import { useState } from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'EE Advisory Services',
    description: 'Expert guidance on Employment Equity compliance and strategy',
    features: [
      {
        title: 'Strategic Planning',
        description: 'Develop comprehensive Employment Equity strategies aligned with business goals',
        icon: '📋'
      },
      {
        title: 'Implementation Support',
        description: 'Hands-on assistance with implementing EE initiatives',
        icon: '🚀'
      },
      {
        title: 'Compliance Assistance',
        description: 'Prepare for and facilitate Department of Labour audits',
        icon: '✅'
      }
    ]
  },
  {
    title: 'Training & Development',
    description: 'Comprehensive training solutions for Employment Equity compliance',
    features: [
      {
        title: 'Compliance Training',
        description: 'Training on EE requirements and best practices',
        icon: '👥'
      },
      {
        title: 'HR Development',
        description: 'Training for HR teams on EE management',
        icon: '📚'
      },
      {
        title: 'Management Training',
        description: 'Leadership training on EE implementation',
        icon: '🎯'
      }
    ]
  },
  {
    title: 'Reporting & Analytics',
    description: 'Professional Employment Equity reporting and analysis',
    features: [
      {
        title: 'Report Generation',
        description: 'Automated EEA2 and EEA4 report generation',
        icon: '📊'
      },
      {
        title: 'Data Analysis',
        description: 'In-depth analysis of workforce demographics',
        icon: '📈'
      },
      {
        title: 'Progress Tracking',
        description: 'Monitor and track EE transformation progress',
        icon: '📍'
      }
    ]
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Our Services
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Expert Employment Equity consulting services to help your organization achieve its transformation goals.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={service.title}
            className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
              activeService === index ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setActiveService(index)}
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <div className="space-y-4">
                {service.features.map((feature) => (
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