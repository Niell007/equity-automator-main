import { EmployeeRecord, ComplianceReport } from '@/types';
import { queries, mutations } from '@/lib/db';

interface DemographicMetrics {
  total: number;
  percentages: Record<string, number>;
  counts: Record<string, number>;
}

interface SalaryMetrics {
  average: number;
  median: number;
  byDemographic: Record<string, {
    average: number;
    median: number;
    gap?: number;
  }>;
}

export class ComplianceService {
  private static calculateDemographicMetrics(
    employees: EmployeeRecord[],
    field: 'gender' | 'ethnicity'
  ): DemographicMetrics {
    const total = employees.length;
    const counts: Record<string, number> = {};
    const percentages: Record<string, number> = {};

    // Calculate counts
    employees.forEach((employee) => {
      const value = employee[field];
      counts[value] = (counts[value] || 0) + 1;
    });

    // Calculate percentages
    Object.entries(counts).forEach(([key, count]) => {
      percentages[key] = (count / total) * 100;
    });

    return {
      total,
      counts,
      percentages,
    };
  }

  private static calculateSalaryMetrics(
    employees: EmployeeRecord[],
    field: 'gender' | 'ethnicity'
  ): SalaryMetrics {
    const salaries = employees.map((e) => e.salary || 0).filter((s) => s > 0);
    const average = salaries.reduce((a, b) => a + b, 0) / salaries.length;
    const sortedSalaries = [...salaries].sort((a, b) => a - b);
    const median =
      sortedSalaries.length % 2 === 0
        ? (sortedSalaries[sortedSalaries.length / 2 - 1] +
            sortedSalaries[sortedSalaries.length / 2]) /
          2
        : sortedSalaries[Math.floor(sortedSalaries.length / 2)];

    // Calculate metrics by demographic group
    const byDemographic: Record<string, { average: number; median: number }> = {};
    const groups = new Map<string, number[]>();

    employees.forEach((employee) => {
      if (employee.salary) {
        const value = employee[field];
        if (!groups.has(value)) {
          groups.set(value, []);
        }
        groups.get(value)?.push(employee.salary);
      }
    });

    groups.forEach((salaries, group) => {
      const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;
      const sorted = [...salaries].sort((a, b) => a - b);
      const med =
        sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];

      byDemographic[group] = {
        average: avg,
        median: med,
      };
    });

    // Calculate pay gaps relative to highest paid group
    const highestPaidGroup = Object.entries(byDemographic).reduce(
      (a, b) => (a[1].average > b[1].average ? a : b)
    )[0];

    Object.entries(byDemographic).forEach(([group, metrics]) => {
      if (group !== highestPaidGroup) {
        metrics.gap =
          ((byDemographic[highestPaidGroup].average - metrics.average) /
            byDemographic[highestPaidGroup].average) *
          100;
      }
    });

    return {
      average,
      median,
      byDemographic,
    };
  }

  public static async generateReport(organizationId: number): Promise<ComplianceReport> {
    // Fetch all active employees
    const employees = await queries.getEmployeesByOrganization(organizationId);
    if (!employees) throw new Error('No employees found');

    const activeEmployees = employees.filter((e) => e.status === 'ACTIVE');

    // Calculate metrics
    const genderMetrics = this.calculateDemographicMetrics(activeEmployees, 'gender');
    const ethnicityMetrics = this.calculateDemographicMetrics(
      activeEmployees,
      'ethnicity'
    );
    const salarySummary = this.calculateSalaryMetrics(activeEmployees, 'gender');
    const ethnicPayGap = this.calculateSalaryMetrics(activeEmployees, 'ethnicity');

    // Generate report data
    const reportData = {
      summary: {
        totalEmployees: activeEmployees.length,
        reportingPeriod: new Date().toISOString().split('T')[0],
      },
      demographics: {
        gender: genderMetrics,
        ethnicity: ethnicityMetrics,
      },
      payEquity: {
        overall: {
          averageSalary: salarySummary.average,
          medianSalary: salarySummary.median,
        },
        genderPayGap: salarySummary.byDemographic,
        ethnicPayGap: ethnicPayGap.byDemographic,
      },
      recommendations: this.generateRecommendations({
        genderMetrics,
        ethnicityMetrics,
        salarySummary,
        ethnicPayGap,
      }),
    };

    // Create report in database
    const report = await mutations.createComplianceReport({
      organizationId,
      reportingPeriod: reportData.summary.reportingPeriod,
      status: 'DRAFT',
      data: JSON.stringify(reportData),
    });

    return report;
  }

  private static generateRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];

    // Gender balance recommendations
    const genderImbalance = Object.entries(metrics.genderMetrics.percentages).some(
      ([_, percentage]) => percentage > 70 || percentage < 30
    );
    if (genderImbalance) {
      recommendations.push(
        'Consider implementing targeted recruitment strategies to improve gender balance across the organization.'
      );
    }

    // Pay gap recommendations
    const significantPayGap = Object.values(metrics.salarySummary.byDemographic).some(
      (group: any) => group.gap && group.gap > 10
    );
    if (significantPayGap) {
      recommendations.push(
        'Review compensation practices and implement pay equity adjustments to address significant pay gaps.'
      );
    }

    // Ethnic diversity recommendations
    const lowDiversity = Object.keys(metrics.ethnicityMetrics.percentages).length < 3;
    if (lowDiversity) {
      recommendations.push(
        'Develop diversity recruitment initiatives to increase ethnic representation across all levels.'
      );
    }

    return recommendations;
  }
} 