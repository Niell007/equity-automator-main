import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

export const About: React.FC = () => {
  const navigate = useNavigate()

  const benefits = [
    {
      icon: 'shield',
      title: 'Enhanced Compliance',
      description: 'Stay compliant with automated monitoring and real-time updates on regulatory changes.'
    },
    {
      icon: 'clock',
      title: 'Time Savings',
      description: 'Reduce manual work with automated document processing and workflow management.'
    },
    {
      icon: 'trending-up',
      title: 'Improved Efficiency',
      description: 'Streamline operations with integrated tools and automated compliance processes.'
    },
    {
      icon: 'eye',
      title: 'Better Visibility',
      description: 'Gain insights with comprehensive reporting and real-time compliance monitoring.'
    }
  ]

  const expertise = [
    {
      area: 'Document Management',
      description: 'Secure storage and processing of compliance documents with version control.'
    },
    {
      area: 'Regulatory Compliance',
      description: 'Up-to-date knowledge of regulatory requirements and compliance standards.'
    },
    {
      area: 'Risk Assessment',
      description: 'Advanced risk analysis and mitigation strategies for compliance.'
    },
    {
      area: 'Process Automation',
      description: 'Automated workflows and compliance processes for efficiency.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Company Overview Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              About Equity Automator
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transforming Compliance Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're dedicated to simplifying compliance processes through innovative technology
              and automated solutions, helping organizations stay compliant effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Equity Automator, we believe compliance shouldn't be a burden. Our mission
                is to provide organizations with powerful, user-friendly tools that transform
                complex compliance requirements into manageable, automated processes.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We're committed to helping businesses maintain compliance while focusing on
                their core operations, leveraging cutting-edge technology to streamline
                regulatory processes.
              </p>
              <Button size="lg" onClick={() => navigate('/dashboard')}>
                Explore Our Solutions
              </Button>
            </div>
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-0">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Icon name="check-circle" className="w-6 h-6 text-primary" />
                    <span className="text-lg">Automated Compliance Management</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Icon name="check-circle" className="w-6 h-6 text-primary" />
                    <span className="text-lg">Real-time Monitoring</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Icon name="check-circle" className="w-6 h-6 text-primary" />
                    <span className="text-lg">Secure Document Management</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Icon name="check-circle" className="w-6 h-6 text-primary" />
                    <span className="text-lg">Comprehensive Reporting</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Benefits of Choosing Equity Automator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Icon
                    name={benefit.icon}
                    className="w-12 h-12 text-primary mb-4 mx-auto"
                  />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {expertise.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.area}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Compliance Process?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Contact our team to learn how Equity Automator can help your organization
            streamline compliance management.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/messaging-support')}
            >
              Contact Us
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}