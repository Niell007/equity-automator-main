import React from 'react'
import { ServiceCard } from '@/components/ui/service-card'
import { StatsCard } from '@/components/ui/stats-card'

const services = [
  {
    title: 'B-BBEE Advisory Services',
    description: 'Expert guidance on B-BBEE compliance and strategy',
    icon: 'lightbulb',
    features: [
      {
        title: 'Strategic Planning',
        description: 'Develop comprehensive B-BBEE strategies aligned with business goals',
      },
      {
        title: 'Gap Analysis',
        description: 'Identify compliance gaps and improvement opportunities',
      },
      {
        title: 'Implementation Support',
        description: 'Hands-on assistance with implementing B-BBEE initiatives',
      },
      {
        title: 'Verification Preparation',
        description: 'Prepare for and facilitate B-BBEE verification process',
      },
    ],
  },
  {
    title: 'Training & Development',
    description: 'Comprehensive training solutions for B-BBEE compliance',
    icon: 'users',
    features: [
      {
        title: 'Skills Programs',
        description: 'Accredited training programs for various skill levels',
      },
      {
        title: 'Learnerships',
        description: 'Structured workplace learning and development programs',
      },
      {
        title: 'Management Training',
        description: 'Leadership development for transformation goals',
      },
      {
        title: 'Compliance Training',
        description: 'Training on B-BBEE requirements and best practices',
      },
    ],
  },
  {
    title: 'Verification Services',
    description: 'Independent B-BBEE verification and certification',
    icon: 'check-square',
    features: [
      {
        title: 'Pre-Assessment',
        description: 'Evaluate readiness for official verification',
      },
      {
        title: 'Documentation Review',
        description: 'Thorough review of compliance documentation',
      },
      {
        title: 'On-Site Verification',
        description: 'Comprehensive verification process at your premises',
      },
      {
        title: 'Certificate Issuance',
        description: 'Official B-BBEE status certificate issuance',
      },
    ],
  },
]

const stats = [
  {
    title: 'Clients Served',
    value: '500+',
    icon: 'users',
    trend: {
      value: 25,
      label: 'vs last year',
      direction: 'up',
    },
  },
  {
    title: 'Success Rate',
    value: '98%',
    icon: 'target',
    trend: {
      value: 5,
      label: 'vs last year',
      direction: 'up',
    },
  },
  {
    title: 'Years Experience',
    value: '10+',
    icon: 'calendar',
  },
]

export function Services() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Professional Services
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Expert B-BBEE consulting and verification services to help your organization achieve its transformation goals.
          </p>
        </div>
        
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
              features={service.features}
              ctaLabel="Request Service"
              onCtaClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 