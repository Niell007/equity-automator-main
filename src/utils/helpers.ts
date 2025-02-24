import { EmployeeRecord, ComplianceReport } from '@/types';

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const groupEmployeesByDepartment = (employees: EmployeeRecord[]): Record<string, EmployeeRecord[]> => {
  return employees.reduce((acc, employee) => {
    const { department } = employee;
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(employee);
    return acc;
  }, {} as Record<string, EmployeeRecord[]>);
};

export const calculateComplianceMetrics = (employees: EmployeeRecord[]): Record<string, number> => {
  const total = employees.length;
  const metrics: Record<string, number> = {};
  
  // Gender distribution
  const genderGroups = employees.reduce((acc, emp) => {
    acc[emp.gender] = (acc[emp.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(genderGroups).forEach(([gender, count]) => {
    metrics[`gender_${gender.toLowerCase()}_percentage`] = (count / total) * 100;
  });
  
  // Ethnicity distribution
  const ethnicityGroups = employees.reduce((acc, emp) => {
    acc[emp.ethnicity] = (acc[emp.ethnicity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(ethnicityGroups).forEach(([ethnicity, count]) => {
    metrics[`ethnicity_${ethnicity.toLowerCase()}_percentage`] = (count / total) * 100;
  });
  
  return metrics;
};

export const generateReportSummary = (report: ComplianceReport): string => {
  const summary = [];
  const { data } = report;
  
  if (data.totalEmployees) {
    summary.push(`Total Employees: ${data.totalEmployees}`);
  }
  
  if (data.genderDistribution) {
    summary.push('Gender Distribution:');
    Object.entries(data.genderDistribution).forEach(([gender, percentage]) => {
      summary.push(`  ${gender}: ${percentage}%`);
    });
  }
  
  if (data.ethnicityDistribution) {
    summary.push('Ethnicity Distribution:');
    Object.entries(data.ethnicityDistribution).forEach(([ethnicity, percentage]) => {
      summary.push(`  ${ethnicity}: ${percentage}%`);
    });
  }
  
  return summary.join('\n');
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generatePasswordStrength = (password: string): {
  score: number;
  feedback: string;
} => {
  let score = 0;
  const feedback = [];
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score < 2) feedback.push('Password is weak');
  else if (score < 4) feedback.push('Password is moderate');
  else feedback.push('Password is strong');
  
  return {
    score,
    feedback: feedback.join('. '),
  };
}; 