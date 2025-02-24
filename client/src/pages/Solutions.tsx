import { useState } from 'react';
import { Link } from 'react-router-dom';

const solutions = [
  {
    title: 'EE Reporting Software',
    description: 'Comprehensive Employment Equity management and compliance software solution',
    features: [
      {
        title: 'Real-time Analytics',
        description: 'Real-time Employment Equity metrics and progress monitoring',
        icon: '📊'
      },
      {
        title: 'Document Management',
        description: 'Centralized storage for all Employment Equity related documentation',
        icon: '📁'
      },
      {
        title: 'Automated Reporting',
        description: 'Generate EEA2 and EEA4 reports automatically',
        icon: '📝'
      }
    ]
  },
  {
    title: 'HR Integration',
    description: 'Seamless integration with your existing HR systems',
    features: [
      {
        title: 'Data Sync',
        description: 'Automatic synchronization with HR databases',
        icon: '🔄'
      },
      {
        title: 'Employee Portal',
        description: 'Self-service portal for employee data management',
        icon: '👥'
      },
      {
        title: 'Workflow Automation',
        description: 'Automated approval workflows and notifications',
        icon: '⚡'
      }
    ]
  },
  {
    title: 'Compliance Management',
    description: 'Stay compliant with Employment Equity regulations',
    features: [
      {
        title: 'Compliance Monitoring',
        description: 'Track compliance status and deadlines',
        icon: '✅'
      },
      {
        title: 'Gap Analysis',
        description: 'Identify and address compliance gaps',
        icon: '🔍'
      },
      {
        title: 'Audit Trail',
        description: 'Maintain detailed records of all compliance activities',
        icon: '📋'
      }
    ]
  }
];

export default function Solutions() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Employment Equity Solutions
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive solutions to help your organization achieve and maintain Employment Equity compliance while driving meaningful transformation.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {solutions.map((solution, index) => (
          <div
            key={solution.title}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{solution.title}</h3>
              <p className="text-gray-600 mb-6">{solution.description}</p>
              <div className="space-y-4">
                {solution.features.map((feature) => (
                  <div key={feature.title} className="flex items-start">
                    <span className="text-2xl mr-3">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link
                to="/contact"
                className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
} 