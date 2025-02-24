import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ScorecardFormData {
  companyName: string;
  registrationNumber: string;
  vatNumber: string;
  address: string;
  industry: string;
  scoreComponents: {
    ownershipScore: number;
    managementControlScore: number;
    employmentEquityScore: number;
    skillsDevelopmentScore: number;
    preferentialProcurementScore: number;
    enterpriseDevelopmentScore: number;
    socioEconomicDevelopmentScore: number;
  };
}

const BBBEEScorecard: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ScorecardFormData>({
    companyName: '',
    registrationNumber: '',
    vatNumber: '',
    address: '',
    industry: '',
    scoreComponents: {
      ownershipScore: 0,
      managementControlScore: 0,
      employmentEquityScore: 0,
      skillsDevelopmentScore: 0,
      preferentialProcurementScore: 0,
      enterpriseDevelopmentScore: 0,
      socioEconomicDevelopmentScore: 0,
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('Score')) {
      setFormData((prev) => ({
        ...prev,
        scoreComponents: {
          ...prev.scoreComponents,
          [name]: parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports/bbbee-scorecard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate scorecard');
      }

      const data = await response.json();
      setResult(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate scorecard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            B-BBEE Scorecard Generator
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the form below to generate a B-BBEE scorecard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Company Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Basic information about your company.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="registrationNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="vatNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      VAT Number
                    </label>
                    <input
                      type="text"
                      name="vatNumber"
                      id="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="industry"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Industry
                    </label>
                    <select
                      name="industry"
                      id="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select industry</option>
                      <option value="CONSTRUCTION">Construction</option>
                      <option value="FINANCIAL_SERVICES">Financial Services</option>
                      <option value="ICT">ICT</option>
                      <option value="MANUFACTURING">Manufacturing</option>
                      <option value="MINING">Mining</option>
                      <option value="RETAIL">Retail</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Components */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Score Components
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the scores for each B-BBEE component.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="ownershipScore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ownership (max 25)
                    </label>
                    <input
                      type="number"
                      name="ownershipScore"
                      id="ownershipScore"
                      min="0"
                      max="25"
                      step="0.1"
                      value={formData.scoreComponents.ownershipScore}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="managementControlScore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Management Control (max 19)
                    </label>
                    <input
                      type="number"
                      name="managementControlScore"
                      id="managementControlScore"
                      min="0"
                      max="19"
                      step="0.1"
                      value={formData.scoreComponents.managementControlScore}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="employmentEquityScore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Employment Equity (max 20)
                    </label>
                    <input
                      type="number"
                      name="employmentEquityScore"
                      id="employmentEquityScore"
                      min="0"
                      max="20"
                      step="0.1"
                      value={formData.scoreComponents.employmentEquityScore}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="skillsDevelopmentScore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Skills Development (max 25)
                    </label>
                    <input
                      type="number"
                      name="skillsDevelopmentScore"
                      id="skillsDevelopmentScore"
                      min="0"
                      max="25"
                      step="0.1"
                      value={formData.scoreComponents.skillsDevelopmentScore}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="preferentialProcurementScore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Preferential Procurement (max 25)
                    </label>
                    <input
                      type="number"
                      name="preferentialProcurementScore"
                      id="preferentialProcurementScore"
                      min="0"
                      max="25"
                      step="0.1"
                      value={formData.scoreComponents.preferentialProcurementScore}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="enterpriseDevelopmentScore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enterprise Development (max 15)
                    </label>
                    <input
                      type="number"
                      name="enterpriseDevelopmentScore"
                      id="enterpriseDevelopmentScore"
                      min="0"
                      max="15"
                      step="0.1"
                      value={formData.scoreComponents.enterpriseDevelopmentScore}
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="socioEconomicDevelopmentScore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Socio-Economic Development (max 5)
                    </label>
                    <input
                      type="number"
                      name="socioEconomicDevelopmentScore"
                      id="socioEconomicDevelopmentScore"
                      min="0"
                      max="5"
                      step="0.1"
                      value={
                        formData.scoreComponents.socioEconomicDevelopmentScore
                      }
                      onChange={handleChange}
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? 'Generating...' : 'Generate Scorecard'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Scorecard Result
              </h3>
              <div className="mt-5">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Score
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {result.data.totalScore.toFixed(2)}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      B-BBEE Level
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {result.data.level}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BBBEEScorecard; 