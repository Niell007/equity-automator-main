import React, { useState, useEffect } from 'react'
import { TICKET_STATUS, TICKET_CATEGORIES, SUPPORT_CONFIG, type TicketStatus, type TicketCategory } from '@/config/features'
import { getSupportConfig, isSupportFeatureEnabled } from '@/utils/env'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { Form } from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { Loader } from '@/components/ui/loader'
import { FileUpload } from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'

interface Ticket {
  id: string
  subject: string
  description: string
  category: TicketCategory
  status: TicketStatus
  priority: string
  createdAt: string
  updatedAt: string
  attachments: Array<{
    id: string
    name: string
    size: number
  }>
  messages: Array<{
    id: string
    content: string
    sender: string
    timestamp: string
    isStaff: boolean
  }>
}

interface KnowledgeArticle {
  id: string
  title: string
  category: string
  content: string
  helpful: number
  notHelpful: number
}

interface MessagingSupportState {
  isLoading: boolean
  error: string | null
  activeTab: 'tickets' | 'chat' | 'knowledge-base'
  tickets: Ticket[]
  selectedTicket: Ticket | null
  showNewTicketModal: boolean
  isSubmittingTicket: boolean
  knowledgeBase: {
    articles: KnowledgeArticle[]
    searchQuery: string
    selectedCategory: string
  }
  chat: {
    isOnline: boolean
    messages: Array<{
      id: string
      content: string
      sender: 'user' | 'agent'
      timestamp: string
    }>
    newMessage: string
  }
  newMessage: string
  filters: {
    status: string
    category: string
    priority: string
  }
  chatAvailable: boolean
  unreadMessages: number
}

export const MessagingSupport: React.FC = () => {
  const supportConfig = getSupportConfig()
  const [state, setState] = useState<MessagingSupportState>({
    isLoading: true,
    error: null,
    activeTab: 'tickets',
    tickets: [],
    selectedTicket: null,
    showNewTicketModal: false,
    isSubmittingTicket: false,
    knowledgeBase: {
      articles: [],
      searchQuery: '',
      selectedCategory: '',
    },
    chat: {
      isOnline: false,
      messages: [],
      newMessage: '',
    },
    newMessage: '',
    filters: {
      status: 'all',
      category: 'all',
      priority: 'all',
    },
    chatAvailable: false,
    unreadMessages: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API calls
        setState(prev => ({
          ...prev,
          isLoading: false,
          tickets: [
            {
              id: '1',
              subject: 'Document Upload Issue',
              description: 'Unable to upload compliance documents',
              category: 'TECHNICAL',
              status: 'OPEN',
              priority: 'high',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              attachments: [
                { id: '1', name: 'screenshot.png', size: 1024 * 1024 },
              ],
              messages: [
                {
                  id: '1',
                  content: 'I am unable to upload any documents. Getting error 500.',
                  sender: 'John Doe',
                  timestamp: new Date().toISOString(),
                  isStaff: false,
                },
              ],
            },
            {
              id: '2',
              subject: 'Compliance Report Question',
              description: 'Need clarification on compliance requirements',
              category: 'COMPLIANCE',
              status: 'IN_PROGRESS',
              priority: 'medium',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              attachments: [],
              messages: [
                {
                  id: '1',
                  content: 'Could you please explain the new compliance requirements?',
                  sender: 'John Doe',
                  timestamp: new Date().toISOString(),
                  isStaff: false,
                },
                {
                  id: '2',
                  content: 'I\'ll be happy to help explain the requirements.',
                  sender: 'Support Staff',
                  timestamp: new Date().toISOString(),
                  isStaff: true,
                },
              ],
            },
          ],
          knowledgeBase: {
            ...prev.knowledgeBase,
            articles: [
              {
                id: '1',
                title: 'How to Upload Documents',
                category: 'getting-started',
                content: 'Step by step guide for uploading documents...',
                helpful: 45,
                notHelpful: 5,
              },
            ],
          },
          chatAvailable: true,
          unreadMessages: 2,
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load support data',
        }))
      }
    }

    fetchData()
  }, [])

  const handleCreateTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState(prev => ({ ...prev, isSubmittingTicket: true }))
    try {
      // TODO: Replace with actual API call
      const formData = new FormData(event.currentTarget)
      console.log('Creating ticket:', Object.fromEntries(formData))
      
      const newTicket: Ticket = {
        id: Date.now().toString(),
        subject: formData.get('subject') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as TicketCategory,
        status: 'OPEN',
        priority: formData.get('priority') as string,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: [],
        messages: [],
      }

      setState(prev => ({
        ...prev,
        tickets: [newTicket, ...prev.tickets],
        showNewTicketModal: false,
        isSubmittingTicket: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create ticket',
        isSubmittingTicket: false,
      }))
    }
  }

  const handleSendMessage = async () => {
    if (!state.selectedTicket || !state.newMessage.trim()) return

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setState(prev => ({
        ...prev,
        tickets: prev.tickets.map(ticket => {
          if (ticket.id === state.selectedTicket.id) {
            return {
              ...ticket,
              messages: [
                ...ticket.messages,
                {
                  id: Date.now().toString(),
                  content: state.newMessage,
                  sender: 'user',
                  timestamp: new Date().toISOString(),
                  isStaff: false,
                },
              ],
            }
          }
          return ticket
        }),
        newMessage: '',
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to send message',
      }))
    }
  }

  const handleSendChatMessage = async () => {
    if (!state.chat.newMessage.trim()) return

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setState(prev => ({
        ...prev,
        chat: {
          ...prev.chat,
          messages: [
            ...prev.chat.messages,
            {
              id: Date.now().toString(),
              content: prev.chat.newMessage,
              sender: 'user',
              timestamp: new Date().toISOString(),
            },
          ],
          newMessage: '',
        },
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to send chat message',
      }))
    }
  }

  const handleArticleFeedback = async (articleId: string, isHelpful: boolean) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setState(prev => ({
        ...prev,
        knowledgeBase: {
          ...prev.knowledgeBase,
          articles: prev.knowledgeBase.articles.map(article => {
            if (article.id === articleId) {
              return {
                ...article,
                helpful: isHelpful ? article.helpful + 1 : article.helpful,
                notHelpful: !isHelpful ? article.notHelpful + 1 : article.notHelpful,
              }
            }
            return article
          }),
        },
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to submit feedback',
      }))
    }
  }

  const handleFileUpload = async (files: FileList) => {
    try {
      // TODO: Implement file upload logic
      console.log('Uploading files:', files)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to upload files',
      }))
    }
  }

  const filteredTickets = state.tickets.filter(ticket => {
    if (state.filters.status !== 'all' && ticket.status !== state.filters.status) return false
    if (state.filters.category !== 'all' && ticket.category !== state.filters.category) return false
    if (state.filters.priority !== 'all' && ticket.priority !== state.filters.priority) return false
    return true
  })

  if (state.isLoading) {
    return <Loader className="w-full h-full" />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900">Support</h1>
        <div className="flex items-center space-x-4">
          {supportConfig.chat.enabled && (
            <Button variant="outline">
              <Icon name="chat" className="w-4 h-4 mr-2" />
              Live Chat
              {state.unreadMessages > 0 && (
                <Badge variant="primary" className="ml-2">
                  {state.unreadMessages}
                </Badge>
              )}
            </Button>
          )}
          <Button variant="primary">
            <Icon name="plus" className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {state.error && (
        <Alert variant="error" className="mb-4">
          {state.error}
        </Alert>
      )}

      <Tabs
        value={state.activeTab}
        onChange={value => setState(prev => ({ ...prev, activeTab: value as typeof state.activeTab }))}
      >
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          {supportConfig.chat.enabled && (
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
          )}
          {supportConfig.knowledge.searchEnabled && (
            <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="tickets">
          <Card>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Select
                    value={state.filters.status}
                    onChange={(value) => setState(prev => ({
                      ...prev,
                      filters: { ...prev.filters, status: value },
                    }))}
                    options={[
                      { label: 'All Status', value: 'all' },
                      ...Object.entries(TICKET_STATUS).map(([key, value]) => ({
                        label: value,
                        value: key,
                      })),
                    ]}
                  />
                </div>
                <Select
                  value={state.filters.category}
                  onChange={(value) => setState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, category: value },
                  }))}
                  options={[
                    { label: 'All Categories', value: 'all' },
                    ...Object.entries(TICKET_CATEGORIES).map(([key, value]) => ({
                      label: value,
                      value: key,
                    })),
                  ]}
                />
                <Select
                  value={state.filters.priority}
                  onChange={(value) => setState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, priority: value },
                  }))}
                  options={[
                    { label: 'All Priorities', value: 'all' },
                    ...supportConfig.ticketing.priorities.map(priority => ({
                      label: priority.charAt(0).toUpperCase() + priority.slice(1),
                      value: priority,
                    })),
                  ]}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Tickets</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.map(ticket => (
                  <Card
                    key={ticket.id}
                    className={`cursor-pointer transition-colors ${
                      state.selectedTicket?.id === ticket.id
                        ? 'border-primary'
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setState(prev => ({ ...prev, selectedTicket: ticket }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{ticket.subject}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            {TICKET_CATEGORIES[ticket.category]}
                          </Badge>
                          <Badge
                            variant={
                              ticket.priority === 'high'
                                ? 'error'
                                : ticket.priority === 'medium'
                                ? 'warning'
                                : 'success'
                            }
                          >
                            {ticket.priority}
                          </Badge>
                          <Badge
                            variant={
                              ticket.status === 'OPEN'
                                ? 'error'
                                : ticket.status === 'IN_PROGRESS'
                                ? 'warning'
                                : 'success'
                            }
                          >
                            {TICKET_STATUS[ticket.status]}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {supportConfig.chat.enabled && (
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${state.chat.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span>{state.chat.isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 p-4">
                    {state.chat.messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <span className="text-xs opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Textarea
                        value={state.chat.newMessage}
                        onChange={e => setState(prev => ({
                          ...prev,
                          chat: { ...prev.chat, newMessage: e.target.value }
                        }))}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendChatMessage}
                        disabled={!state.chat.newMessage.trim()}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {supportConfig.knowledge.searchEnabled && (
          <TabsContent value="knowledge-base">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Knowledge Base</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Search knowledge base..."
                    prefix={<Icon name="search" className="w-4 h-4" />}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supportConfig.knowledge.categories.map(category => (
                      <Card key={category}>
                        <CardContent className="p-4">
                          <h3 className="font-medium capitalize mb-2">{category}</h3>
                          <p className="text-sm text-gray-500">
                            Browse articles and guides about {category}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Modal
        isOpen={state.showNewTicketModal}
        onClose={() => setState(prev => ({ ...prev, showNewTicketModal: false }))}
        title="Create Support Ticket"
      >
        <Form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              className="w-full mt-1"
              required
              placeholder="Brief description of the issue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <Select name="category" className="w-full mt-1" required>
              {Object.entries(TICKET_CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <Select name="priority" className="w-full mt-1" required>
              {supportConfig.ticketing.priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              name="description"
              className="w-full mt-1"
              required
              placeholder="Detailed description of your issue"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attachments</label>
            <input
              type="file"
              multiple
              accept={supportConfig.ticketing.allowedAttachmentTypes.join(',')}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="w-full"
              aria-label="Upload attachments"
              title="Upload attachments"
            />
            <p className="text-sm text-gray-500 mt-1">
              Max {supportConfig.ticketing.maxAttachments} files,
              {(supportConfig.ticketing.maxAttachmentSize / (1024 * 1024)).toFixed(0)}MB each
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setState(prev => ({ ...prev, showNewTicketModal: false }))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={state.isSubmittingTicket}
            >
              {state.isSubmittingTicket ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </Form>
      </Modal>

      {state.selectedTicket && (
        <Modal
          isOpen={!!state.selectedTicket}
          onClose={() => setState(prev => ({ ...prev, selectedTicket: null }))}
          title={`Ticket: ${state.selectedTicket.subject}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  state.selectedTicket.status === 'OPEN' ? 'warning' :
                  state.selectedTicket.status === 'IN_PROGRESS' ? 'info' :
                  state.selectedTicket.status === 'RESOLVED' ? 'success' :
                  'default'
                }
              >
                {TICKET_STATUS[state.selectedTicket.status]}
              </Badge>
              <span className="text-sm text-gray-500">
                Created: {new Date(state.selectedTicket.createdAt).toLocaleString()}
              </span>
            </div>
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-gray-600 mt-1">{state.selectedTicket.description}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Attachments</h4>
              <div className="flex flex-wrap gap-2">
                {state.selectedTicket.attachments.map(attachment => (
                  <Button
                    key={attachment.id}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Icon name="paperclip" className="w-4 h-4 mr-2" />
                    {attachment.name}
                    <span className="text-xs text-gray-500 ml-2">
                      ({(attachment.size / 1024).toFixed(0)}KB)
                    </span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Messages</h4>
              <div className="space-y-4">
                {state.selectedTicket.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.isStaff ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isStaff
                          ? 'bg-gray-100'
                          : 'bg-primary text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.sender}
                        </span>
                        <span className="text-xs opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Textarea
                value={state.newMessage}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  newMessage: e.target.value,
                }))}
                placeholder="Type your reply..."
                rows={3}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!state.newMessage.trim()}
              >
                <Icon name="send" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}