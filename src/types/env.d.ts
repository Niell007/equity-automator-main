/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Required Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: 'development' | 'production'
  readonly VITE_APP_DEBUG: string

  // Supabase Configuration
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string

  // API Configuration
  readonly VITE_API_URL: string
  readonly VITE_API_KEY: string
  readonly VITE_AUTH_API_URL: string
  readonly VITE_DOCUMENTS_API_URL: string
  readonly VITE_REPORTS_API_URL: string
  readonly VITE_SUPPORT_API_URL: string
  readonly VITE_CHAT_API_URL: string

  // Feature Flags
  readonly VITE_ENABLE_LIVE_CHAT: string
  readonly VITE_ENABLE_2FA: string
  readonly VITE_ENABLE_DOCUMENT_EXPORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 