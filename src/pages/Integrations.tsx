import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { INTEGRATION_PROVIDERS, INTEGRATION_CONFIG } from '@/config/features'
import {
  getIntegrationConfig,
  getSSOConfig,
  getCloudStorageConfig,
  getEmailConfig,
  getWorkflowConfig,
  isIntegrationEnabled,
} from '@/utils/env'

interface IntegrationState {
  activeConnections: {
    sso: string[]
    cloudStorage: string[]
    email: string[]
    workflow: string[]
  }
  isLoading: boolean
  error: string | null
}

export const Integrations: React.FC = () => {
  const integrationConfig = getIntegrationConfig()
  const ssoConfig = getSSOConfig()
  const cloudStorageConfig = getCloudStorageConfig()
  const emailConfig = getEmailConfig()
  const workflowConfig = getWorkflowConfig()

  const [state, setState] = useState<IntegrationState>({
    activeConnections: {
      sso: [],
      cloudStorage: [],
      email: [],
      workflow: [],
    },
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchIntegrationStatus = async () => {
      try {
        // TODO: Replace with actual API calls
        // Simulated data for demonstration
        setState(prev => ({
          ...prev,
          isLoading: false,
          activeConnections: {
            sso: ['google'],
            cloudStorage: ['google-drive'],
            email: ['outlook'],
            workflow: ['zapier'],
          },
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load integration status',
        }))
      }
    }

    fetchIntegrationStatus()
  }, [])

  const handleConnect = async (type: string, provider: string) => {
    try {
      // TODO: Implement actual connection logic
      console.log(`Connecting to ${provider} for ${type}`)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to connect to ${provider}`,
      }))
    }
  }

  const handleDisconnect = async (type: string, provider: string) => {
    try {
      // TODO: Implement actual disconnection logic
      console.log(`Disconnecting from ${provider} for ${type}`)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to disconnect from ${provider}`,
      }))
    }
  }

  const renderProviderCard = (type: string, provider: string, isConnected: boolean) => (
    <Card key={provider} className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name={provider.toLowerCase()} className="w-6 h-6" />
            <h3 className="text-lg font-semibold">{provider}</h3>
          </div>
          <Badge variant={isConnected ? 'success' : 'secondary'}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant={isConnected ? 'destructive' : 'primary'}
          className="w-full"
          onClick={() => isConnected ? handleDisconnect(type, provider) : handleConnect(type, provider)}
        >
          <Icon name={isConnected ? 'disconnect' : 'connect'} className="w-4 h-4 mr-2" />
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </CardContent>
    </Card>
  )

  if (state.error) {
    return (
      <Alert variant="error" className="m-4">
        {state.error}
      </Alert>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <Button variant="outline">
          <Icon name="refresh" className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      <Tabs defaultValue="sso" className="w-full">
        <TabsList>
          <TabsTrigger value="sso">Single Sign-On</TabsTrigger>
          <TabsTrigger value="storage">Cloud Storage</TabsTrigger>
          <TabsTrigger value="email">Email Services</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="sso" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(INTEGRATION_PROVIDERS.SSO).map(provider => (
              renderProviderCard(
                'sso',
                provider,
                state.activeConnections.sso.includes(provider.toLowerCase())
              )
            ))}
          </div>
        </TabsContent>

        <TabsContent value="storage" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(INTEGRATION_PROVIDERS.CLOUD_STORAGE).map(provider => (
              renderProviderCard(
                'cloudStorage',
                provider,
                state.activeConnections.cloudStorage.includes(provider.toLowerCase())
              )
            ))}
          </div>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(INTEGRATION_PROVIDERS.EMAIL).map(provider => (
              renderProviderCard(
                'email',
                provider,
                state.activeConnections.email.includes(provider.toLowerCase())
              )
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(INTEGRATION_PROVIDERS.WORKFLOW).map(provider => (
              renderProviderCard(
                'workflow',
                provider,
                state.activeConnections.workflow.includes(provider.toLowerCase())
              )
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Integration Settings</h2>
        <Card>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">API Configuration</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <Badge>{INTEGRATION_CONFIG.api.version}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Limit:</span>
                    <Badge>{INTEGRATION_CONFIG.api.rateLimits.requestsPerMinute}/min</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Security</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>API Key Required:</span>
                    <Badge variant="success">Yes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>OAuth Required:</span>
                    <Badge variant="success">Yes</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}