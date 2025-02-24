import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DASHBOARD_WIDGETS, COMPLIANCE_STATUS, STATUS_COLORS, type DashboardWidgetType } from '@/config/features'
import { getDashboardConfig } from '@/utils/env'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Grid } from '@/components/ui/grid'
import { Loader } from '@/components/ui/loader'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Modal } from '@/components/ui/modal'
import { DragDropContext, Draggable } from '@/components/ui/dnd'

interface DashboardState {
  isLoading: boolean
  error: string | null
  widgets: DashboardWidgetType[]
  complianceStatus: {
    overall: keyof typeof COMPLIANCE_STATUS
    documents: {
      total: number
      upToDate: number
      pending: number
      expired: number
    }
    tasks: {
      total: number
      completed: number
      upcoming: number
      overdue: number
    }
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    user: string
    details?: string
  }>
  notifications: Array<{
    id: string
    type: string
    message: string
    isRead: boolean
    priority: 'high' | 'medium' | 'low'
    timestamp: string
  }>
  kpis: {
    complianceScore: number
    documentsProcessed: number
    activeIntegrations: number
    pendingTasks: number
  }
  showCustomizeModal: boolean
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const dashboardConfig = getDashboardConfig()
  const [state, setState] = useState<DashboardState>({
    isLoading: true,
    error: null,
    widgets: dashboardConfig.defaultWidgets as DashboardWidgetType[],
    complianceStatus: {
      overall: COMPLIANCE_STATUS.PENDING,
      documents: {
        total: 0,
        upToDate: 0,
        pending: 0,
        expired: 0
      },
      tasks: {
        total: 0,
        completed: 0,
        upcoming: 0,
        overdue: 0
      }
    },
    recentActivity: [],
    notifications: [],
    kpis: {
      complianceScore: 0,
      documentsProcessed: 0,
      activeIntegrations: 0,
      pendingTasks: 0
    },
    showCustomizeModal: false
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API calls
        setState(prev => ({
          ...prev,
          isLoading: false,
          complianceStatus: {
            overall: COMPLIANCE_STATUS.IN_PROGRESS,
            documents: {
              total: 48,
              upToDate: 45,
              pending: 2,
              expired: 1
            },
            tasks: {
              total: 15,
              completed: 12,
              upcoming: 2,
              overdue: 1
            }
          },
          recentActivity: [
            {
              id: '1',
              type: 'document',
              description: 'Compliance report uploaded',
              timestamp: new Date().toISOString(),
              user: 'John Doe',
              details: 'Q1 2024 Compliance Report'
            },
            {
              id: '2',
              type: 'compliance',
              description: 'Monthly compliance check completed',
              timestamp: new Date().toISOString(),
              user: 'System',
              details: 'All checks passed successfully'
            },
            {
              id: '3',
              type: 'integration',
              description: 'New integration connected',
              timestamp: new Date().toISOString(),
              user: 'Jane Smith',
              details: 'Connected to Google Drive'
            }
          ],
          notifications: [
            {
              id: '1',
              type: 'alert',
              message: 'Compliance report due in 3 days',
              isRead: false,
              priority: 'high',
              timestamp: new Date().toISOString()
            },
            {
              id: '2',
              type: 'warning',
              message: '2 documents pending review',
              isRead: false,
              priority: 'medium',
              timestamp: new Date().toISOString()
            },
            {
              id: '3',
              type: 'info',
              message: 'New feature available: Document versioning',
              isRead: true,
              priority: 'low',
              timestamp: new Date().toISOString()
            }
          ],
          kpis: {
            complianceScore: 98,
            documentsProcessed: 156,
            activeIntegrations: 5,
            pendingTasks: 3
          }
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load dashboard data'
        }))
      }
    }

    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, dashboardConfig.refreshInterval)
    return () => clearInterval(interval)
  }, [dashboardConfig.refreshInterval])

  const handleNotificationClick = (notificationId: string) => {
    // TODO: Implement notification handling
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    }))
  }

  const handleWidgetReorder = (result: any) => {
    if (!result.destination) return

    const items = Array.from(state.widgets)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setState(prev => ({ ...prev, widgets: items }))
  }

  const renderWidget = (widgetId: DashboardWidgetType) => {
    const widget = DASHBOARD_WIDGETS[widgetId]

    switch (widgetId) {
      case 'compliance-status':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{widget.title}</h3>
                <Badge variant={STATUS_COLORS[state.complianceStatus.overall]}>
                  {state.complianceStatus.overall}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Overall Compliance Score</span>
                    <Badge variant="primary">{state.kpis.complianceScore}%</Badge>
                  </div>
                  <Progress value={state.kpis.complianceScore} max={100} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Documents</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Up to Date</span>
                        <Badge variant="success">
                          {state.complianceStatus.documents.upToDate}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pending</span>
                        <Badge variant="warning">
                          {state.complianceStatus.documents.pending}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Expired</span>
                        <Badge variant="error">
                          {state.complianceStatus.documents.expired}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Tasks</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <Badge variant="success">
                          {state.complianceStatus.tasks.completed}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Upcoming</span>
                        <Badge variant="warning">
                          {state.complianceStatus.tasks.upcoming}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Overdue</span>
                        <Badge variant="error">
                          {state.complianceStatus.tasks.overdue}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'recent-activity':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{widget.title}</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/compliance-reports')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="mt-1">
                      <Icon name={activity.type} className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                      {activity.details && (
                        <p className="text-xs text-gray-600">{activity.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case 'notifications':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{widget.title}</h3>
                <Badge variant="primary">
                  {state.notifications.filter(n => !n.isRead).length} New
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-2 rounded cursor-pointer transition-colors ${
                      notification.isRead ? 'bg-transparent' : 'bg-primary/5'
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="mt-1">
                      <Icon
                        name={notification.type}
                        className={`w-5 h-5 ${
                          notification.priority === 'high'
                            ? 'text-red-500'
                            : notification.priority === 'medium'
                            ? 'text-yellow-500'
                            : 'text-blue-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-900'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            notification.priority === 'high'
                              ? 'error'
                              : notification.priority === 'medium'
                              ? 'warning'
                              : 'info'
                          }
                          className="text-xs"
                        >
                          {notification.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case 'quick-actions':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <h3 className="text-lg font-semibold">{widget.title}</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/compliance-reports')}
                >
                  <Icon name="file-plus" className="w-4 h-4 mr-2" />
                  New Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/messaging-support')}
                >
                  <Icon name="message-circle" className="w-4 h-4 mr-2" />
                  Get Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/integrations')}
                >
                  <Icon name="plug" className="w-4 h-4 mr-2" />
                  Integrations
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/user-profile')}
                >
                  <Icon name="settings" className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'kpi-summary':
        return (
          <Card key={widget.id} className="h-full">
            <CardHeader>
              <h3 className="text-lg font-semibold">{widget.title}</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {state.kpis.documentsProcessed}
                  </div>
                  <div className="text-sm text-gray-600">Documents Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {state.kpis.activeIntegrations}
                  </div>
                  <div className="text-sm text-gray-600">Active Integrations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {state.kpis.complianceScore}%
                  </div>
                  <div className="text-sm text-gray-600">Compliance Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {state.kpis.pendingTasks}
                  </div>
                  <div className="text-sm text-gray-600">Pending Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  if (state.isLoading) {
    return <Loader className="w-full h-full" />
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
        <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's your compliance overview.
          </p>
        </div>
        {dashboardConfig.enableCustomization && (
          <Button
            variant="outline"
            onClick={() => setState(prev => ({ ...prev, showCustomizeModal: true }))}
          >
            <Icon name="layout" className="w-4 h-4 mr-2" />
            Customize Dashboard
          </Button>
        )}
      </div>

      <DragDropContext onDragEnd={handleWidgetReorder}>
        <Grid className="gap-6">
          {state.widgets.map((widgetId, index) => (
            <Draggable key={widgetId} draggableId={widgetId} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="col-span-1"
                >
                  {renderWidget(widgetId)}
        </div>
              )}
            </Draggable>
          ))}
        </Grid>
      </DragDropContext>

      <Modal
        isOpen={state.showCustomizeModal}
        onClose={() => setState(prev => ({ ...prev, showCustomizeModal: false }))}
        title="Customize Dashboard"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Drag and drop widgets to reorder them on your dashboard.
            Toggle widgets to show or hide them.
          </p>
          {/* Add widget customization UI here */}
        </div>
      </Modal>
    </div>
  )
}