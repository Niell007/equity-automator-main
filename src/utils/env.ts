interface ImportMetaEnv {
  // Required Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: 'development' | 'production'
  readonly VITE_APP_DEBUG: string

  // API Configuration
  readonly VITE_API_URL: string
  readonly VITE_API_KEY: string
  readonly VITE_AUTH_API_URL: string
  readonly VITE_DOCUMENTS_API_URL: string
  readonly VITE_REPORTS_API_URL: string
  readonly VITE_SUPPORT_API_URL: string
  readonly VITE_CHAT_API_URL: string

  // Authentication Configuration
  readonly VITE_AUTH_SESSION_TIMEOUT: string
  readonly VITE_AUTH_MAX_LOGIN_ATTEMPTS: string
  readonly VITE_AUTH_PASSWORD_MIN_LENGTH: string
  readonly VITE_AUTH_PASSWORD_EXPIRY_DAYS: string
  readonly VITE_AUTH_2FA_ENABLED: string
  readonly VITE_AUTH_2FA_TYPE: string

  // Document Management Configuration
  readonly VITE_DOCUMENT_MAX_FILE_SIZE: string
  readonly VITE_DOCUMENT_ALLOWED_TYPES: string
  readonly VITE_DOCUMENT_ENABLE_BULK_UPLOAD: string
  readonly VITE_DOCUMENT_ENABLE_VERSION_CONTROL: string
  readonly VITE_DOCUMENT_AUTO_DELETE_DAYS: string
  readonly VITE_DOCUMENT_ENCRYPTION_ENABLED: string

  // Compliance Reports Configuration
  readonly VITE_REPORTS_DEFAULT_FORMAT: string
  readonly VITE_REPORTS_AVAILABLE_FORMATS: string
  readonly VITE_REPORTS_ENABLE_EMAIL: string
  readonly VITE_REPORTS_MAX_HISTORY_DAYS: string
  readonly VITE_REPORTS_ENABLE_CUSTOM_TEMPLATES: string
  readonly VITE_REPORTS_AUTO_SCHEDULE: string

  // Dashboard Configuration
  readonly VITE_DASHBOARD_REFRESH_INTERVAL: string
  readonly VITE_DASHBOARD_ACTIVITY_LIMIT: string
  readonly VITE_DASHBOARD_ENABLE_CUSTOMIZATION: string
  readonly VITE_DASHBOARD_DEFAULT_WIDGETS: string

  // Database Configuration
  readonly VITE_DB_HOST: string
  readonly VITE_DB_PORT: string
  readonly VITE_DB_NAME: string
  readonly VITE_DB_USER: string
  readonly VITE_DB_PASSWORD: string

  // Feature Flags
  readonly VITE_ENABLE_LIVE_CHAT: string
  readonly VITE_ENABLE_2FA: string
  readonly VITE_ENABLE_DOCUMENT_EXPORT: string

  // Messaging and Support Configuration
  readonly VITE_SUPPORT_TICKET_CATEGORIES: string
  readonly VITE_SUPPORT_PRIORITIES: string
  readonly VITE_SUPPORT_RESPONSE_TIMES: string
  readonly VITE_SUPPORT_LANGUAGES: string
  readonly VITE_SUPPORT_CHAT_HOURS: string
  readonly VITE_SUPPORT_MAX_ATTACHMENTS: string
  readonly VITE_SUPPORT_MAX_ATTACHMENT_SIZE: string
  readonly VITE_SUPPORT_ENABLE_COMMUNITY: string
  readonly VITE_SUPPORT_ENABLE_FEEDBACK: string

  // User Profile Configuration
  readonly VITE_PROFILE_ENABLE_2FA: string
  readonly VITE_PROFILE_ENABLE_SECURITY_QUESTIONS: string
  readonly VITE_PROFILE_MAX_SECURITY_QUESTIONS: string
  readonly VITE_PROFILE_PICTURE_MAX_SIZE: string
  readonly VITE_PROFILE_COMPANY_LOGO_MAX_SIZE: string
  readonly VITE_PROFILE_SESSION_TIMEOUT: string
  readonly VITE_PROFILE_PASSWORD_EXPIRY_DAYS: string
  readonly VITE_PROFILE_ENABLE_SOCIAL_LOGIN: string
  readonly VITE_PROFILE_ENABLE_COMPANY_BRANDING: string

  // Integration Configuration
  readonly VITE_INTEGRATION_API_VERSION: string
  readonly VITE_INTEGRATION_API_TIMEOUT: string
  readonly VITE_INTEGRATION_WEBHOOK_URL: string
  readonly VITE_INTEGRATION_MAX_BATCH_SIZE: string

  // SSO Configuration
  readonly VITE_SSO_ENABLED: string
  readonly VITE_SSO_PROVIDERS: string
  readonly VITE_SSO_GOOGLE_CLIENT_ID: string
  readonly VITE_SSO_MICROSOFT_CLIENT_ID: string
  readonly VITE_SSO_OKTA_CLIENT_ID: string
  readonly VITE_SSO_CALLBACK_URL: string

  // Cloud Storage Integration
  readonly VITE_CLOUD_STORAGE_ENABLED: string
  readonly VITE_CLOUD_PROVIDERS: string
  readonly VITE_CLOUD_MAX_FILE_SIZE: string
  readonly VITE_CLOUD_ALLOWED_TYPES: string

  // Email Integration
  readonly VITE_EMAIL_INTEGRATION_ENABLED: string
  readonly VITE_EMAIL_PROVIDERS: string
  readonly VITE_EMAIL_MAX_ATTACHMENT_SIZE: string
  readonly VITE_EMAIL_TEMPLATE_PATH: string

  // Workflow Automation
  readonly VITE_WORKFLOW_AUTOMATION_ENABLED: string
  readonly VITE_WORKFLOW_PROVIDERS: string
  readonly VITE_WORKFLOW_MAX_TRIGGERS: string
  readonly VITE_WORKFLOW_MAX_ACTIONS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export interface ApiEndpoints {
  base: string
  auth: string
  documents: string
  reports: string
  support: string
  chat: string
}

export interface AuthConfig {
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  passwordExpiryDays: number
  twoFactorEnabled: boolean
  twoFactorType: '2fa_app' | '2fa_sms' | '2fa_email'
}

export interface DocumentConfig {
  maxFileSize: number
  allowedTypes: string[]
  enableBulkUpload: boolean
  enableVersionControl: boolean
  autoDeleteDays: number
  encryptionEnabled: boolean
}

export interface ReportConfig {
  defaultFormat: 'pdf' | 'excel' | 'csv'
  availableFormats: string[]
  enableEmail: boolean
  maxHistoryDays: number
  enableCustomTemplates: boolean
  autoSchedule: boolean
}

export interface DashboardConfig {
  refreshInterval: number
  activityLimit: number
  enableCustomization: boolean
  defaultWidgets: string[]
}

export interface FeatureFlags {
  enableLiveChat: boolean
  enable2FA: boolean
  enableDocumentExport: boolean
}

export interface DatabaseConfig {
  host: string
  port: number
  name: string
  user: string
  password: string
}

export interface SupportConfig {
  ticketCategories: string[]
  priorities: string[]
  responseTimes: Record<string, number>
  languages: string[]
  chatHours: string
  maxAttachments: number
  maxAttachmentSize: number
  enableCommunity: boolean
  enableFeedback: boolean
}

export interface ProfileConfig {
  enable2FA: boolean
  enableSecurityQuestions: boolean
  maxSecurityQuestions: number
  pictureMaxSize: number
  companyLogoMaxSize: number
  sessionTimeout: number
  passwordExpiryDays: number
  enableSocialLogin: boolean
  enableCompanyBranding: boolean
}

export interface IntegrationConfig {
  apiVersion: string
  apiTimeout: number
  webhookUrl: string
  maxBatchSize: number
}

export interface SSOConfig {
  enabled: boolean
  providers: string[]
  clientIds: Record<string, string>
  callbackUrl: string
}

export interface CloudStorageConfig {
  enabled: boolean
  providers: string[]
  maxFileSize: number
  allowedTypes: string[]
}

export interface EmailIntegrationConfig {
  enabled: boolean
  providers: string[]
  maxAttachmentSize: number
  templatePath: string
}

export interface WorkflowConfig {
  enabled: boolean
  providers: string[]
  maxTriggers: number
  maxActions: number
}

export const env = {
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME,
  appEnv: import.meta.env.VITE_APP_ENV,
  isDebug: import.meta.env.VITE_APP_DEBUG === 'true',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',

  // API Configuration
  apiKey: import.meta.env.VITE_API_KEY,
  endpoints: {
    base: import.meta.env.VITE_API_URL,
    auth: import.meta.env.VITE_AUTH_API_URL,
    documents: import.meta.env.VITE_DOCUMENTS_API_URL,
    reports: import.meta.env.VITE_REPORTS_API_URL,
    support: import.meta.env.VITE_SUPPORT_API_URL,
    chat: import.meta.env.VITE_CHAT_API_URL,
  } as ApiEndpoints,

  // Authentication Configuration
  auth: {
    sessionTimeout: parseInt(import.meta.env.VITE_AUTH_SESSION_TIMEOUT),
    maxLoginAttempts: parseInt(import.meta.env.VITE_AUTH_MAX_LOGIN_ATTEMPTS),
    passwordMinLength: parseInt(import.meta.env.VITE_AUTH_PASSWORD_MIN_LENGTH),
    passwordExpiryDays: parseInt(import.meta.env.VITE_AUTH_PASSWORD_EXPIRY_DAYS),
    twoFactorEnabled: import.meta.env.VITE_AUTH_2FA_ENABLED === 'true',
    twoFactorType: import.meta.env.VITE_AUTH_2FA_TYPE as AuthConfig['twoFactorType'],
  } as AuthConfig,

  // Document Management Configuration
  documents: {
    maxFileSize: parseInt(import.meta.env.VITE_DOCUMENT_MAX_FILE_SIZE),
    allowedTypes: import.meta.env.VITE_DOCUMENT_ALLOWED_TYPES.split(','),
    enableBulkUpload: import.meta.env.VITE_DOCUMENT_ENABLE_BULK_UPLOAD === 'true',
    enableVersionControl: import.meta.env.VITE_DOCUMENT_ENABLE_VERSION_CONTROL === 'true',
    autoDeleteDays: parseInt(import.meta.env.VITE_DOCUMENT_AUTO_DELETE_DAYS),
    encryptionEnabled: import.meta.env.VITE_DOCUMENT_ENCRYPTION_ENABLED === 'true',
  } as DocumentConfig,

  // Compliance Reports Configuration
  reports: {
    defaultFormat: import.meta.env.VITE_REPORTS_DEFAULT_FORMAT as ReportConfig['defaultFormat'],
    availableFormats: JSON.parse(import.meta.env.VITE_REPORTS_AVAILABLE_FORMATS),
    enableEmail: import.meta.env.VITE_REPORTS_ENABLE_EMAIL === 'true',
    maxHistoryDays: parseInt(import.meta.env.VITE_REPORTS_MAX_HISTORY_DAYS),
    enableCustomTemplates: import.meta.env.VITE_REPORTS_ENABLE_CUSTOM_TEMPLATES === 'true',
    autoSchedule: import.meta.env.VITE_REPORTS_AUTO_SCHEDULE === 'true',
  } as ReportConfig,

  // Dashboard Configuration
  dashboard: {
    refreshInterval: parseInt(import.meta.env.VITE_DASHBOARD_REFRESH_INTERVAL),
    activityLimit: parseInt(import.meta.env.VITE_DASHBOARD_ACTIVITY_LIMIT),
    enableCustomization: import.meta.env.VITE_DASHBOARD_ENABLE_CUSTOMIZATION === 'true',
    defaultWidgets: JSON.parse(import.meta.env.VITE_DASHBOARD_DEFAULT_WIDGETS),
  } as DashboardConfig,

  // Database Configuration
  db: {
    host: import.meta.env.VITE_DB_HOST,
    port: parseInt(import.meta.env.VITE_DB_PORT),
    name: import.meta.env.VITE_DB_NAME,
    user: import.meta.env.VITE_DB_USER,
    password: import.meta.env.VITE_DB_PASSWORD,
  } as DatabaseConfig,

  // Feature Flags
  features: {
    enableLiveChat: import.meta.env.VITE_ENABLE_LIVE_CHAT === 'true',
    enable2FA: import.meta.env.VITE_ENABLE_2FA === 'true',
    enableDocumentExport: import.meta.env.VITE_ENABLE_DOCUMENT_EXPORT === 'true',
  } as FeatureFlags,

  // Support Configuration
  support: {
    ticketCategories: JSON.parse(import.meta.env.VITE_SUPPORT_TICKET_CATEGORIES),
    priorities: JSON.parse(import.meta.env.VITE_SUPPORT_PRIORITIES),
    responseTimes: JSON.parse(import.meta.env.VITE_SUPPORT_RESPONSE_TIMES),
    languages: JSON.parse(import.meta.env.VITE_SUPPORT_LANGUAGES),
    chatHours: import.meta.env.VITE_SUPPORT_CHAT_HOURS,
    maxAttachments: parseInt(import.meta.env.VITE_SUPPORT_MAX_ATTACHMENTS),
    maxAttachmentSize: parseInt(import.meta.env.VITE_SUPPORT_MAX_ATTACHMENT_SIZE),
    enableCommunity: import.meta.env.VITE_SUPPORT_ENABLE_COMMUNITY === 'true',
    enableFeedback: import.meta.env.VITE_SUPPORT_ENABLE_FEEDBACK === 'true',
  } as SupportConfig,

  // Profile Configuration
  profile: {
    enable2FA: import.meta.env.VITE_PROFILE_ENABLE_2FA === 'true',
    enableSecurityQuestions: import.meta.env.VITE_PROFILE_ENABLE_SECURITY_QUESTIONS === 'true',
    maxSecurityQuestions: parseInt(import.meta.env.VITE_PROFILE_MAX_SECURITY_QUESTIONS),
    pictureMaxSize: parseInt(import.meta.env.VITE_PROFILE_PICTURE_MAX_SIZE),
    companyLogoMaxSize: parseInt(import.meta.env.VITE_PROFILE_COMPANY_LOGO_MAX_SIZE),
    sessionTimeout: parseInt(import.meta.env.VITE_PROFILE_SESSION_TIMEOUT),
    passwordExpiryDays: parseInt(import.meta.env.VITE_PROFILE_PASSWORD_EXPIRY_DAYS),
    enableSocialLogin: import.meta.env.VITE_PROFILE_ENABLE_SOCIAL_LOGIN === 'true',
    enableCompanyBranding: import.meta.env.VITE_PROFILE_ENABLE_COMPANY_BRANDING === 'true',
  } as ProfileConfig,

  // Integration Configuration
  integration: {
    apiVersion: import.meta.env.VITE_INTEGRATION_API_VERSION,
    apiTimeout: parseInt(import.meta.env.VITE_INTEGRATION_API_TIMEOUT),
    webhookUrl: import.meta.env.VITE_INTEGRATION_WEBHOOK_URL,
    maxBatchSize: parseInt(import.meta.env.VITE_INTEGRATION_MAX_BATCH_SIZE),
  } as IntegrationConfig,

  // SSO Configuration
  sso: {
    enabled: import.meta.env.VITE_SSO_ENABLED === 'true',
    providers: JSON.parse(import.meta.env.VITE_SSO_PROVIDERS),
    clientIds: {
      google: import.meta.env.VITE_SSO_GOOGLE_CLIENT_ID,
      microsoft: import.meta.env.VITE_SSO_MICROSOFT_CLIENT_ID,
      okta: import.meta.env.VITE_SSO_OKTA_CLIENT_ID,
    },
    callbackUrl: import.meta.env.VITE_SSO_CALLBACK_URL,
  } as SSOConfig,

  // Cloud Storage Configuration
  cloudStorage: {
    enabled: import.meta.env.VITE_CLOUD_STORAGE_ENABLED === 'true',
    providers: JSON.parse(import.meta.env.VITE_CLOUD_PROVIDERS),
    maxFileSize: parseInt(import.meta.env.VITE_CLOUD_MAX_FILE_SIZE),
    allowedTypes: JSON.parse(import.meta.env.VITE_CLOUD_ALLOWED_TYPES),
  } as CloudStorageConfig,

  // Email Integration Configuration
  email: {
    enabled: import.meta.env.VITE_EMAIL_INTEGRATION_ENABLED === 'true',
    providers: JSON.parse(import.meta.env.VITE_EMAIL_PROVIDERS),
    maxAttachmentSize: parseInt(import.meta.env.VITE_EMAIL_MAX_ATTACHMENT_SIZE),
    templatePath: import.meta.env.VITE_EMAIL_TEMPLATE_PATH,
  } as EmailIntegrationConfig,

  // Workflow Configuration
  workflow: {
    enabled: import.meta.env.VITE_WORKFLOW_AUTOMATION_ENABLED === 'true',
    providers: JSON.parse(import.meta.env.VITE_WORKFLOW_PROVIDERS),
    maxTriggers: parseInt(import.meta.env.VITE_WORKFLOW_MAX_TRIGGERS),
    maxActions: parseInt(import.meta.env.VITE_WORKFLOW_MAX_ACTIONS),
  } as WorkflowConfig,
} as const

// Type guard functions
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return env.features[feature]
}

export const getApiEndpoint = (endpoint: keyof ApiEndpoints): string => {
  return env.endpoints[endpoint]
}

// Authentication utility functions
export const getAuthConfig = (): AuthConfig => env.auth

// Document Management utility functions
export const getDocumentConfig = (): DocumentConfig => env.documents
export const isDocumentTypeAllowed = (fileType: string): boolean => {
  return env.documents.allowedTypes.includes(fileType.toLowerCase())
}
export const getMaxFileSize = (): number => env.documents.maxFileSize

// Compliance Reports utility functions
export const getReportConfig = (): ReportConfig => env.reports
export const isReportFormatSupported = (format: string): boolean => {
  return env.reports.availableFormats.includes(format.toLowerCase())
}

// Dashboard utility functions
export const getDashboardConfig = (): DashboardConfig => env.dashboard

// Support utility functions
export const getSupportConfig = (): SupportConfig => env.support
export const isSupportFeatureEnabled = (feature: keyof Pick<SupportConfig, 'enableCommunity' | 'enableFeedback'>): boolean => {
  return env.support[feature]
}

// Profile utility functions
export const getProfileConfig = (): ProfileConfig => env.profile
export const isProfileFeatureEnabled = (feature: keyof Pick<ProfileConfig, 'enable2FA' | 'enableSecurityQuestions' | 'enableSocialLogin' | 'enableCompanyBranding'>): boolean => {
  return env.profile[feature]
}

// Integration utility functions
export const getIntegrationConfig = (): IntegrationConfig => env.integration
export const getSSOConfig = (): SSOConfig => env.sso
export const getCloudStorageConfig = (): CloudStorageConfig => env.cloudStorage
export const getEmailConfig = (): EmailIntegrationConfig => env.email
export const getWorkflowConfig = (): WorkflowConfig => env.workflow

export const isIntegrationEnabled = (type: 'sso' | 'cloudStorage' | 'email' | 'workflow'): boolean => {
  switch (type) {
    case 'sso':
      return env.sso.enabled
    case 'cloudStorage':
      return env.cloudStorage.enabled
    case 'email':
      return env.email.enabled
    case 'workflow':
      return env.workflow.enabled
    default:
      return false
  }
} 