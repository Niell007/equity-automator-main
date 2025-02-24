import { env } from '@/utils/env'

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const

export type UserRole = keyof typeof ROLES

export interface UserPermissions {
  canUploadDocuments: boolean
  canDeleteDocuments: boolean
  canGenerateReports: boolean
  canManageUsers: boolean
  canAccessSupport: boolean
  canCustomizeDashboard: boolean
  canManageApiKeys: boolean
  canBulkUpload: boolean
  canScheduleReports: boolean
  canCreateTemplates: boolean
  canEncryptDocuments: boolean
}

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    canUploadDocuments: true,
    canDeleteDocuments: true,
    canGenerateReports: true,
    canManageUsers: true,
    canAccessSupport: true,
    canCustomizeDashboard: true,
    canManageApiKeys: true,
    canBulkUpload: true,
    canScheduleReports: true,
    canCreateTemplates: true,
    canEncryptDocuments: true,
  },
  user: {
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canGenerateReports: true,
    canManageUsers: false,
    canAccessSupport: true,
    canCustomizeDashboard: true,
    canManageApiKeys: false,
    canBulkUpload: env.documents.enableBulkUpload,
    canScheduleReports: env.reports.autoSchedule,
    canCreateTemplates: false,
    canEncryptDocuments: false,
  },
}

export const AUTH_CONFIG = {
  passwordRequirements: {
    minLength: env.auth.passwordMinLength,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: env.auth.passwordExpiryDays,
  },
  twoFactor: {
    enabled: env.auth.twoFactorEnabled,
    type: env.auth.twoFactorType,
    backupCodesCount: 10,
  },
  session: {
    timeout: env.auth.sessionTimeout,
    maxLoginAttempts: env.auth.maxLoginAttempts,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes
  },
} as const

export const DASHBOARD_WIDGETS = {
  'compliance-status': {
    id: 'compliance-status',
    title: 'Compliance Status',
    description: 'Overview of your current compliance status',
    defaultPosition: 0,
    refreshInterval: env.dashboard.refreshInterval,
  },
  'recent-activity': {
    id: 'recent-activity',
    title: 'Recent Activity',
    description: 'Latest actions and updates',
    defaultPosition: 1,
    limit: env.dashboard.activityLimit,
  },
  'notifications': {
    id: 'notifications',
    title: 'Notifications',
    description: 'Important alerts and reminders',
    defaultPosition: 2,
  },
  'quick-actions': {
    id: 'quick-actions',
    title: 'Quick Actions',
    description: 'Frequently used actions',
    defaultPosition: 3,
  },
  'compliance-metrics': {
    id: 'compliance-metrics',
    title: 'Compliance Metrics',
    description: 'Key performance indicators',
    defaultPosition: 4,
  },
  'upcoming-deadlines': {
    id: 'upcoming-deadlines',
    title: 'Upcoming Deadlines',
    description: 'Upcoming tasks and deadlines',
    defaultPosition: 5,
  },
} as const

export type DashboardWidgetType = keyof typeof DASHBOARD_WIDGETS

export const COMPLIANCE_STATUS = {
  COMPLIANT: 'compliant',
  PENDING: 'pending',
  NON_COMPLIANT: 'non-compliant',
} as const

export type ComplianceStatus = keyof typeof COMPLIANCE_STATUS

export const STATUS_COLORS = {
  [COMPLIANCE_STATUS.COMPLIANT]: 'green',
  [COMPLIANCE_STATUS.PENDING]: 'yellow',
  [COMPLIANCE_STATUS.NON_COMPLIANT]: 'red',
} as const

export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const

export type DocumentStatus = keyof typeof DOCUMENT_STATUS

export const DOCUMENT_TYPES = {
  COMPLIANCE: 'compliance',
  REPORT: 'report',
  SUPPORT: 'support',
  TEMPLATE: 'template',
} as const

export type DocumentType = keyof typeof DOCUMENT_TYPES

export const ALLOWED_DOCUMENT_FORMATS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.csv',
] as const

export const REPORT_FORMATS = [
  'pdf',
  'excel',
  'csv',
] as const

export const SUPPORT_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const

export const DOCUMENT_CONFIG = {
  upload: {
    maxFileSize: env.documents.maxFileSize,
    allowedTypes: env.documents.allowedTypes,
    enableBulkUpload: env.documents.enableBulkUpload,
    maxBulkFiles: 10,
  },
  versioning: {
    enabled: env.documents.enableVersionControl,
    maxVersions: 5,
    keepDays: 90,
  },
  security: {
    encryption: env.documents.encryptionEnabled,
    encryptionAlgorithm: 'AES-256-GCM',
    autoDelete: {
      enabled: true,
      days: env.documents.autoDeleteDays,
    },
  },
  display: {
    itemsPerPage: 20,
    sortOptions: ['name', 'date', 'status', 'type'],
    filterOptions: ['status', 'type', 'date'],
  },
} as const

export const REPORT_TYPES = {
  COMPLIANCE_SUMMARY: 'compliance-summary',
  DOCUMENT_STATUS: 'document-status',
  ACTIVITY_LOG: 'activity-log',
  CUSTOM: 'custom',
} as const

export type ReportType = keyof typeof REPORT_TYPES

export const REPORT_CONFIG = {
  generation: {
    defaultFormat: env.reports.defaultFormat,
    availableFormats: env.reports.availableFormats,
    enableEmail: env.reports.enableEmail,
    scheduling: {
      enabled: env.reports.autoSchedule,
      frequencies: ['daily', 'weekly', 'monthly', 'quarterly'],
    },
  },
  templates: {
    enabled: env.reports.enableCustomTemplates,
    maxCustomTemplates: 10,
    defaultTemplates: Object.keys(REPORT_TYPES),
  },
  history: {
    maxDays: env.reports.maxHistoryDays,
    maxStoredReports: 100,
  },
  display: {
    itemsPerPage: 15,
    sortOptions: ['date', 'type', 'format'],
    filterOptions: ['type', 'format', 'date'],
  },
} as const

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const

export type TicketStatus = keyof typeof TICKET_STATUS

export const TICKET_CATEGORIES = {
  TECHNICAL: 'technical',
  COMPLIANCE: 'compliance',
  BILLING: 'billing',
  OTHER: 'other',
} as const

export type TicketCategory = keyof typeof TICKET_CATEGORIES

export const NOTIFICATION_TYPES = {
  TICKET_UPDATE: 'ticket-update',
  DOCUMENT_STATUS: 'document-status',
  COMPLIANCE_ALERT: 'compliance-alert',
  SYSTEM_MESSAGE: 'system-message',
} as const

export type NotificationType = keyof typeof NOTIFICATION_TYPES

export const PROFILE_CONFIG = {
  security: {
    twoFactor: {
      enabled: env.profile.enable2FA,
      methods: ['app', 'sms', 'email'],
      backupCodes: 10,
    },
    securityQuestions: {
      enabled: env.profile.enableSecurityQuestions,
      required: 2,
      maxQuestions: env.profile.maxSecurityQuestions,
    },
    session: {
      timeout: env.profile.sessionTimeout,
      extendOnActivity: true,
      maxConcurrentSessions: 3,
    },
    password: {
      expiryDays: env.profile.passwordExpiryDays,
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  },
  preferences: {
    notifications: {
      email: true,
      inApp: true,
      desktop: false,
    },
    language: 'en',
    timezone: 'UTC',
  },
  branding: {
    enableCompanyBranding: env.profile.enableCompanyBranding,
    pictureMaxSize: env.profile.pictureMaxSize,
    companyLogoMaxSize: env.profile.companyLogoMaxSize,
    allowedImageTypes: ['.jpg', '.jpeg', '.png'],
  },
  socialLogin: {
    enabled: env.profile.enableSocialLogin,
    providers: ['google', 'microsoft'],
  },
} as const

export const SUPPORT_CONFIG = {
  ticketing: {
    categories: env.support.ticketCategories,
    priorities: env.support.priorities,
    responseTimes: env.support.responseTimes,
    maxAttachments: env.support.maxAttachments,
    maxAttachmentSize: env.support.maxAttachmentSize,
    allowedAttachmentTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png'],
  },
  chat: {
    enabled: env.features.enableLiveChat,
    operatingHours: env.support.chatHours,
    languages: env.support.languages,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['.jpg', '.png', '.pdf'],
  },
  community: {
    enabled: env.support.enableCommunity,
    moderationEnabled: true,
    maxTopicLength: 200,
    maxPostLength: 2000,
    allowedTags: ['question', 'discussion', 'announcement'],
  },
  feedback: {
    enabled: env.support.enableFeedback,
    categories: ['support', 'portal', 'compliance'],
    ratingScale: 5,
    requireComments: false,
  },
  knowledge: {
    categories: ['getting-started', 'compliance', 'portal-guide', 'faq'],
    searchEnabled: true,
    feedbackEnabled: true,
  },
} as const

export const INTEGRATION_PROVIDERS = {
  SSO: {
    GOOGLE: 'google',
    MICROSOFT: 'microsoft',
    OKTA: 'okta',
  },
  CLOUD_STORAGE: {
    GOOGLE_DRIVE: 'google-drive',
    DROPBOX: 'dropbox',
    ONEDRIVE: 'onedrive',
  },
  EMAIL: {
    OUTLOOK: 'outlook',
    GMAIL: 'gmail',
  },
  WORKFLOW: {
    ZAPIER: 'zapier',
    INTEGROMAT: 'integromat',
  },
} as const

export type SSOProvider = keyof typeof INTEGRATION_PROVIDERS.SSO
export type CloudStorageProvider = keyof typeof INTEGRATION_PROVIDERS.CLOUD_STORAGE
export type EmailProvider = keyof typeof INTEGRATION_PROVIDERS.EMAIL
export type WorkflowProvider = keyof typeof INTEGRATION_PROVIDERS.WORKFLOW

export const INTEGRATION_CONFIG = {
  api: {
    version: env.integration.apiVersion,
    timeout: env.integration.apiTimeout,
    webhookUrl: env.integration.webhookUrl,
    maxBatchSize: env.integration.maxBatchSize,
    rateLimits: {
      requestsPerMinute: 60,
      batchRequestsPerMinute: 10,
    },
    security: {
      requireApiKey: true,
      requireOAuth: true,
      tokenExpiry: 3600, // 1 hour
    },
  },
  sso: {
    enabled: env.sso.enabled,
    providers: env.sso.providers,
    clientIds: env.sso.clientIds,
    callbackUrl: env.sso.callbackUrl,
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenEnabled: true,
    autoRegister: true,
  },
  cloudStorage: {
    enabled: env.cloudStorage.enabled,
    providers: env.cloudStorage.providers,
    maxFileSize: env.cloudStorage.maxFileSize,
    allowedTypes: env.cloudStorage.allowedTypes,
    syncInterval: 5 * 60 * 1000, // 5 minutes
    autoSync: true,
    retryAttempts: 3,
  },
  email: {
    enabled: env.email.enabled,
    providers: env.email.providers,
    maxAttachmentSize: env.email.maxAttachmentSize,
    templatePath: env.email.templatePath,
    defaultTemplates: {
      welcome: 'welcome.html',
      notification: 'notification.html',
      report: 'report.html',
    },
    scheduling: {
      enabled: true,
      maxScheduledEmails: 1000,
    },
  },
  workflow: {
    enabled: env.workflow.enabled,
    providers: env.workflow.providers,
    maxTriggers: env.workflow.maxTriggers,
    maxActions: env.workflow.maxActions,
    triggers: {
      document: ['created', 'updated', 'deleted', 'status-changed'],
      report: ['generated', 'shared', 'exported'],
      compliance: ['status-changed', 'deadline-approaching'],
      user: ['login', 'logout', 'profile-updated'],
    },
    actions: {
      notification: ['send-email', 'send-slack', 'create-ticket'],
      document: ['create', 'update', 'delete', 'share'],
      report: ['generate', 'export', 'schedule'],
      compliance: ['update-status', 'create-task'],
    },
  },
} as const

export const FEATURE_CONFIG = {
  auth: AUTH_CONFIG,
  documents: DOCUMENT_CONFIG,
  reports: REPORT_CONFIG,
  dashboard: {
    enableCustomization: env.dashboard.enableCustomization,
    defaultWidgets: env.dashboard.defaultWidgets,
    refreshInterval: env.dashboard.refreshInterval,
    widgets: DASHBOARD_WIDGETS,
  },
  support: SUPPORT_CONFIG,
  profile: PROFILE_CONFIG,
  integrations: INTEGRATION_CONFIG,
} as const 