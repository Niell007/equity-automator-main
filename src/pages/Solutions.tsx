import React from 'react'
import { ServiceCard } from '@/components/ui/service-card'
import { BBEEBadge } from '@/components/ui/bbee-badge'

const solutions = [
  {
    title: 'B-BBEE Software',
    description: 'Comprehensive B-BBEE management and compliance software solution',
    icon: 'laptop',
    features: [
      {
        title: 'Automated Scorecard Calculation',
        description: 'Real-time B-BBEE score calculation and monitoring',
      },
      {
        title: 'Document Management',
        description: 'Centralized storage for all B-BBEE related documentation',
      },
      {
        title: 'Compliance Tracking',
        description: 'Track and monitor compliance status across all elements',
      },
      {
        title: 'Report Generation',
        description: 'Generate detailed compliance reports and certificates',
      },
    ],
  },
  {
    title: 'Skills Development',
    description: 'Strategic skills development and training management solution',
    icon: 'graduation-cap',
    features: [
      {
        title: 'Training Program Management',
        description: 'Plan and track training initiatives and budgets',
      },
      {
        title: 'Learnership Administration',
        description: 'Manage learnerships and skills programs efficiently',
      },
      {
        title: 'Progress Monitoring',
        description: 'Track individual and organizational learning progress',
      },
      {
        title: 'ROI Reporting',
        description: 'Measure and report on training investment returns',
      },
    ],
  },
  {
    title: 'Enterprise Development',
    description: 'End-to-end enterprise and supplier development solution',
    icon: 'building',
    features: [
      {
        title: 'Supplier Database',
        description: 'Maintain a verified database of B-BBEE suppliers',
      },
      {
        title: 'Development Programs',
        description: 'Track and manage supplier development initiatives',
      },
      {
        title: 'Financial Support',
        description: 'Monitor financial contributions and investments',
      },
      {
        title: 'Impact Assessment',
        description: 'Measure the impact of development programs',
      },
    ],
  },
]

export function Solutions() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            B-BBEE Solutions
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions to help your organization achieve and maintain B-BBEE compliance while driving meaningful transformation.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <BBEEBadge level={1} />
            <BBEEBadge level={2} />
            <BBEEBadge level={3} />
          </div>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <ServiceCard
              key={solution.title}
              title={solution.title}
              description={solution.description}
              icon={solution.icon}
              features={solution.features}
              ctaLabel="Learn More"
              onCtaClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 