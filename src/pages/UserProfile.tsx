import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { PROFILE_CONFIG } from '@/config/features'
import { getProfileConfig, isProfileFeatureEnabled } from '@/utils/env'

interface UserProfileState {
  isLoading: boolean
  error: string | null
  profile: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
    role: string
    avatar: string | null
    companyLogo: string | null
    twoFactorEnabled: boolean
    securityQuestions: Array<{
      question: string
      isAnswered: boolean
    }>
    notifications: {
      email: boolean
      inApp: boolean
      desktop: boolean
    }
    language: string
    timezone: string
  }
}

export const UserProfile: React.FC = () => {
  const profileConfig = getProfileConfig()
  const [state, setState] = useState<UserProfileState>({
    isLoading: true,
    error: null,
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      role: '',
      avatar: null,
      companyLogo: null,
      twoFactorEnabled: false,
      securityQuestions: [],
      notifications: {
        email: true,
        inApp: true,
        desktop: false,
      },
      language: 'en',
      timezone: 'UTC',
    },
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulated data for demonstration
        setState(prev => ({
          ...prev,
          isLoading: false,
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            company: 'Acme Corp',
            role: 'Administrator',
            avatar: null,
            companyLogo: null,
            twoFactorEnabled: true,
            securityQuestions: [
              { question: 'What was your first pet\'s name?', isAnswered: true },
              { question: 'In what city were you born?', isAnswered: true },
              { question: 'What is your mother\'s maiden name?', isAnswered: false },
            ],
            notifications: {
              email: true,
              inApp: true,
              desktop: false,
            },
            language: 'en',
            timezone: 'UTC',
          },
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load user profile',
        }))
      }
    }

    fetchUserProfile()
  }, [])

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    // TODO: Implement profile update logic
  }

  const handleFileUpload = async (type: 'avatar' | 'companyLogo', file: File) => {
    try {
      // TODO: Implement file upload logic
      console.log(`Uploading ${type}:`, file)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to upload ${type}`,
      }))
    }
  }

  const handleToggle2FA = async () => {
    try {
      // TODO: Implement 2FA toggle logic
      console.log('Toggling 2FA')
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update 2FA settings',
      }))
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <Button variant="outline">
          <Icon name="save" className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    {state.profile.avatar ? (
                      <img
                        src={state.profile.avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Icon name="user" className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-0 right-0"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Icon name="upload" className="w-4 h-4" />
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    aria-label="Upload profile picture"
                    title="Upload profile picture"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('avatar', e.target.files[0])}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {state.profile.firstName} {state.profile.lastName}
                  </h2>
                  <p className="text-gray-500">{state.profile.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={state.profile.firstName}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      profile: { ...prev.profile, firstName: e.target.value }
                    }))}
                  />
                  <Input
                    label="Last Name"
                    value={state.profile.lastName}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      profile: { ...prev.profile, lastName: e.target.value }
                    }))}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={state.profile.email}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      profile: { ...prev.profile, email: e.target.value }
                    }))}
                  />
                  <Input
                    label="Phone"
                    value={state.profile.phone}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      profile: { ...prev.profile, phone: e.target.value }
                    }))}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-sm text-gray-500">
                      {state.profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <Switch
                    checked={state.profile.twoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                  />
                </div>
                {state.profile.twoFactorEnabled && (
                  <Button variant="outline" className="w-full">
                    <Icon name="qrcode" className="w-4 h-4 mr-2" />
                    View Recovery Codes
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Security Questions</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {state.profile.securityQuestions.map((q, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <p className="text-sm">{q.question}</p>
                      <Badge variant={q.isAnswered ? 'success' : 'warning'}>
                        {q.isAnswered ? 'Answered' : 'Not Set'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={state.profile.notifications.email}
                    onCheckedChange={(checked) => setState(prev => ({
                      ...prev,
                      profile: {
                        ...prev.profile,
                        notifications: { ...prev.profile.notifications, email: checked }
                      }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">In-App Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates within the app</p>
                  </div>
                  <Switch
                    checked={state.profile.notifications.inApp}
                    onCheckedChange={(checked) => setState(prev => ({
                      ...prev,
                      profile: {
                        ...prev.profile,
                        notifications: { ...prev.profile.notifications, inApp: checked }
                      }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Desktop Notifications</p>
                    <p className="text-sm text-gray-500">Receive desktop notifications</p>
                  </div>
                  <Switch
                    checked={state.profile.notifications.desktop}
                    onCheckedChange={(checked) => setState(prev => ({
                      ...prev,
                      profile: {
                        ...prev.profile,
                        notifications: { ...prev.profile.notifications, desktop: checked }
                      }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Company Information</h3>
                {profileConfig.enableCompanyBranding && (
                  <Badge variant="secondary">Branding Enabled</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  value={state.profile.company}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    profile: { ...prev.profile, company: e.target.value }
                  }))}
                />
                <Input
                  label="Role"
                  value={state.profile.role}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    profile: { ...prev.profile, role: e.target.value }
                  }))}
                />
              </div>

              {profileConfig.enableCompanyBranding && (
                <div>
                  <p className="font-medium mb-2">Company Logo</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                      {state.profile.companyLogo ? (
                        <img
                          src={state.profile.companyLogo}
                          alt="Company Logo"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Icon name="building" className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Icon name="upload" className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-sm text-gray-500">
                        Max size: {(profileConfig.companyLogoMaxSize / (1024 * 1024)).toFixed(1)}MB
                      </p>
                      <input
                        id="logo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        aria-label="Upload company logo"
                        title="Upload company logo"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('companyLogo', e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}