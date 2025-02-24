import { useState } from 'react';
import { Employee, dataService } from '../../lib/supabase';

interface EmployeeFormProps {
  onSubmit: (employee: Employee) => void;
  initialData?: Partial<Employee>;
}

export default function EmployeeForm({ onSubmit, initialData }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    department: initialData?.department || '',
    position: initialData?.position || '',
    employment_equity_data: {
      gender: initialData?.employment_equity_data?.gender || '',
      race: initialData?.employment_equity_data?.race || '',
      disability_status: initialData?.employment_equity_data?.disability_status || false,
      citizenship: initialData?.employment_equity_data?.citizenship || ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('ee_')) {
      const field = name.replace('ee_', '');
      setFormData(prev => ({
        ...prev,
        employment_equity_data: {
          ...prev.employment_equity_data,
          [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const employee = await dataService.employees.create(formData);
      onSubmit(employee);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            placeholder="Enter first name"
            title="Employee's first name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            placeholder="Enter last name"
            title="Employee's last name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
            title="Employee's email address"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
          <input
            id="department"
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            placeholder="Enter department"
            title="Employee's department"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
          <input
            id="position"
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            placeholder="Enter position"
            title="Employee's position"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Equity Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ee_gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="ee_gender"
              name="ee_gender"
              value={formData.employment_equity_data.gender}
              onChange={handleChange}
              required
              title="Employee's gender"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non_binary">Non-binary</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label htmlFor="ee_race" className="block text-sm font-medium text-gray-700">Race</label>
            <select
              id="ee_race"
              name="ee_race"
              value={formData.employment_equity_data.race}
              onChange={handleChange}
              required
              title="Employee's race"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Race</option>
              <option value="african">African</option>
              <option value="coloured">Coloured</option>
              <option value="indian">Indian</option>
              <option value="white">White</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="ee_citizenship" className="block text-sm font-medium text-gray-700">Citizenship</label>
            <select
              id="ee_citizenship"
              name="ee_citizenship"
              value={formData.employment_equity_data.citizenship}
              onChange={handleChange}
              required
              title="Employee's citizenship status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Citizenship</option>
              <option value="south_african">South African</option>
              <option value="permanent_resident">Permanent Resident</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center h-full">
            <label htmlFor="ee_disability_status" className="flex items-center">
              <input
                id="ee_disability_status"
                type="checkbox"
                name="ee_disability_status"
                checked={formData.employment_equity_data.disability_status}
                onChange={handleChange}
                title="Indicate if employee has a disability"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Person with Disability</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Employee'}
        </button>
      </div>
    </form>
  );
} 