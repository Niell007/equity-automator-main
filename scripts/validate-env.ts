import { z } from 'zod'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// Load environment variables based on NODE_ENV
const NODE_ENV = process.env.NODE_ENV || 'development'
const envFile = NODE_ENV === 'production' ? '.env.production' : '.env'
const envPath = path.join(rootDir, envFile)

console.log(`Loading environment from: ${envPath}`)
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error(`❌ Error loading ${envFile}:`, result.error.message)
  process.exit(1)
}

// Define environment schema with optional fields
const envSchema = z.object({
  // Required fields
  VITE_APP_NAME: z.string().min(1, "APP_NAME is required"),
  VITE_APP_ENV: z.enum(['development', 'production']).default('development'),
  VITE_APP_DEBUG: z.enum(['true', 'false']).default('false'),
  
  // API Configuration
  VITE_API_URL: z.string().url(),
  VITE_API_KEY: z.string().min(1),
  VITE_AUTH_API_URL: z.string().url(),
  VITE_DOCUMENTS_API_URL: z.string().url(),
  VITE_REPORTS_API_URL: z.string().url(),
  VITE_SUPPORT_API_URL: z.string().url(),
  VITE_CHAT_API_URL: z.string().url(),
  
  // Database Configuration - optional for development
  VITE_DB_HOST: z.string().min(1).optional(),
  VITE_DB_PORT: z.string().regex(/^\d+$/).optional(),
  VITE_DB_NAME: z.string().min(1).optional(),
  VITE_DB_USER: z.string().min(1).optional(),
  VITE_DB_PASSWORD: z.string().min(1).optional(),
  
  // Feature Flags
  VITE_ENABLE_LIVE_CHAT: z.enum(['true', 'false']).default('false'),
  VITE_ENABLE_2FA: z.enum(['true', 'false']).default('false'),
  VITE_ENABLE_DOCUMENT_EXPORT: z.enum(['true', 'false']).default('false'),
})

try {
  // Extract only VITE_ prefixed variables
  const viteEnvVars = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => key.startsWith('VITE_'))
  )
  
  console.log('\nValidating environment variables...')
  const validatedEnv = envSchema.parse(viteEnvVars)
  
  console.log('\n✅ Environment variables are valid:')
  // Group variables by category for better readability
  const categories = {
    'Required Configuration': ['VITE_APP_NAME', 'VITE_APP_ENV', 'VITE_APP_DEBUG'],
    'API Configuration': ['VITE_API_URL', 'VITE_API_KEY', 'VITE_AUTH_API_URL', 'VITE_DOCUMENTS_API_URL', 'VITE_REPORTS_API_URL', 'VITE_SUPPORT_API_URL', 'VITE_CHAT_API_URL'],
    'Database Configuration': ['VITE_DB_HOST', 'VITE_DB_PORT', 'VITE_DB_NAME', 'VITE_DB_USER', 'VITE_DB_PASSWORD'],
    'Feature Flags': ['VITE_ENABLE_LIVE_CHAT', 'VITE_ENABLE_2FA', 'VITE_ENABLE_DOCUMENT_EXPORT'],
  }
  
  Object.entries(categories).forEach(([category, vars]) => {
    console.log(`\n${category}:`)
    vars.forEach(key => {
      if (key in validatedEnv) {
        const value = validatedEnv[key as keyof typeof validatedEnv]
        const isSensitive = key.includes('KEY') || key.includes('PASSWORD')
        const displayValue = isSensitive ? '****' : value
        console.log(`  - ${key}: ${displayValue}`)
      }
    })
  })
  
  process.exit(0)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('\n❌ Invalid environment variables:')
    error.errors.forEach((err) => {
      console.error(`- ${err.path.join('.')}: ${err.message}`)
    })
  } else {
    console.error('\n❌ An unexpected error occurred:', error)
  }
  
  console.log('\n📝 Required environment variables:')
  console.log('- VITE_APP_NAME: Application name')
  console.log('- VITE_APP_ENV: "development" or "production"')
  console.log('- VITE_APP_DEBUG: "true" or "false"')
  console.log('- VITE_API_URL: Base API URL')
  console.log('- VITE_API_KEY: API authentication key')
  
  process.exit(1)
} 