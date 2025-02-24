import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

export const Home: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: 'shield-check',
      title: 'Compliance Management',
      description: 'Streamline your compliance processes with automated document handling and reporting.',
      link: '/compliance-reports'
    },
    {
      icon: 'users',
      title: 'User Management',
      description: 'Secure user authentication and role-based access control for your organization.',
      link: '/user-profile'
    },
    {
      icon: 'puzzle',
      title: 'Integrations',
      description: 'Connect with popular third-party services and automate your workflows.',
      link: '/integrations'
    },
    {
      icon: 'message-circle',
      title: 'Support & Communication',
      description: '24/7 support with live chat, ticketing system, and knowledge base.',
      link: '/messaging-support'
    }
  ]

  const quickActions = [
    {
      icon: 'file-plus',
      label: 'New Report',
      action: () => navigate('/compliance-reports')
    },
    {
      icon: 'ticket',
      label: 'Create Ticket',
      action: () => navigate('/messaging-support')
    },
    {
      icon: 'book-open',
      label: 'Knowledge Base',
      action: () => navigate('/messaging-support?tab=knowledge-base')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Welcome to Equity Automator
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Complete Compliance Solution
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your compliance processes, manage documents efficiently, and stay up to date
            with regulatory requirements all in one place.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              <Icon name="arrow-right" className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/about')}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(feature.link)}
              >
                <CardContent className="p-6">
                  <Icon
                    name={feature.icon}
                    className="w-12 h-12 text-primary mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={action.action}
              >
                <CardContent className="p-6 flex items-center space-x-4">
                  <Icon name={action.icon} className="w-8 h-8 text-primary" />
                  <span className="text-lg font-medium">{action.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Streamline Your Compliance Process?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of organizations that trust Equity Automator for their compliance needs.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/dashboard')}
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  )
}