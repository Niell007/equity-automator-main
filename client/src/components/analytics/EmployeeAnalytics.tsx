import { useState, useEffect } from 'react';
import { Employee, dataService } from '../../lib/supabase';

interface AnalyticsData {
  totalEmployees: number;
  genderDistribution: Record<string, number>;
  raceDistribution: Record<string, number>;
  disabilityCount: number;
  citizenshipDistribution: Record<string, number>;
}

export default function EmployeeAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData>({
    totalEmployees: 0,
    genderDistribution: {},
    raceDistribution: {},
    disabilityCount: 0,
    citizenshipDistribution: {}
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const employees = await dataService.employees.getAll();
        const analytics = processEmployeeData(employees);
        setData(analytics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function processEmployeeData(employees: Employee[]): AnalyticsData {
    const analytics: AnalyticsData = {
      totalEmployees: employees.length,
      genderDistribution: {},
      raceDistribution: {},
      disabilityCount: 0,
      citizenshipDistribution: {}
    };

    employees.forEach(employee => {
      // Gender distribution
      const gender = employee.employment_equity_data.gender;
      analytics.genderDistribution[gender] = (analytics.genderDistribution[gender] || 0) + 1;

      // Race distribution
      const race = employee.employment_equity_data.race;
      analytics.raceDistribution[race] = (analytics.raceDistribution[race] || 0) + 1;

      // Disability count
      if (employee.employment_equity_data.disability_status) {
        analytics.disabilityCount++;
      }

      // Citizenship distribution
      const citizenship = employee.employment_equity_data.citizenship;
      analytics.citizenshipDistribution[citizenship] = (analytics.citizenshipDistribution[citizenship] || 0) + 1;
    });

    return analytics;
  }

  function calculatePercentage(count: number): string {
    return ((count / data.totalEmployees) * 100).toFixed(1) + '%';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-indigo-600">{data.totalEmployees}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Gender Distribution</h3>
          <div className="space-y-2">
            {Object.entries(data.genderDistribution).map(([gender, count]) => (
              <div key={gender} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{gender.replace('_', ' ')}</span>
                <span className="font-medium">{calculatePercentage(count)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Race Distribution</h3>
          <div className="space-y-2">
            {Object.entries(data.raceDistribution).map(([race, count]) => (
              <div key={race} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{race}</span>
                <span className="font-medium">{calculatePercentage(count)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Disability Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">With Disability</span>
              <span className="font-medium">{calculatePercentage(data.disabilityCount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Without Disability</span>
              <span className="font-medium">
                {calculatePercentage(data.totalEmployees - data.disabilityCount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Citizenship Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(data.citizenshipDistribution).map(([citizenship, count]) => (
            <div key={citizenship} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{citizenship.replace('_', ' ')}</span>
                <span className="font-medium">{calculatePercentage(count)}</span>
              </div>
              <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: calculatePercentage(count) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Tracking</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Gender Representation</span>
              <span className="font-medium text-indigo-600">In Progress</span>
            </div>
            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Race Representation</span>
              <span className="font-medium text-indigo-600">On Track</span>
            </div>
            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Disability Integration</span>
              <span className="font-medium text-indigo-600">Needs Attention</span>
            </div>
            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '35%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 