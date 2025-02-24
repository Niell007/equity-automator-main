# Client and Server Components Guide

## Overview

This guide explains how to effectively use client and server components in our Next.js application, with specific examples from our implementation.

## Component Types

### Server Components (Default)

- Render on the server
- No client-side JavaScript
- Better performance
- No access to browser APIs
- Cannot use hooks or event handlers

### Client Components

- Render on the client
- Can use browser APIs
- Can use React hooks
- Can handle user interactions
- Marked with `'use client'` directive

## When to Use Each

### Use Server Components For

1. Fetching data
2. Accessing backend resources directly
3. Keeping sensitive information on the server
4. Static or content-heavy pages
5. SEO-critical sections

### Use Client Components For

1. Interactivity and event handling
2. Using hooks (useState, useEffect)
3. Using browser APIs
4. Client-side routing
5. Form handling with state

## Implementation Pattern

### 1. Split Interactive Parts

```tsx
// contact-form.tsx (Client Component)
'use client'
export function ContactForm() {
  const [state, setState] = useState()
  // Interactive logic here
}

// page.tsx (Server Component)
export default function ContactPage() {
  // Static content here
  return (
    <div>
      <StaticContent />
      <ContactForm /> {/* Interactive part */}
    </div>
  )
}
```

### 2. Keep Client Components Lean

- Move non-interactive logic to server components
- Only mark components as client when necessary
- Split large client components into smaller ones

## Common Patterns

### 1. Form Handling

```tsx
'use client'
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e) => {
    setIsSubmitting(true)
    // Handle submission
  }
}
```

### 2. Animation Components

```tsx
'use client'
export function AnimatedSection({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={animations}
    >
      {children}
    </motion.div>
  )
}
```

### 3. Interactive UI Elements

```tsx
'use client'
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // Theme switching logic
}
```

## Best Practices

### 1. Component Organization

- Keep client components in separate files
- Use clear naming conventions
- Group related components together

### 2. Performance Optimization

- Minimize client-side JavaScript
- Use server components where possible
- Implement code splitting

### 3. State Management

- Keep state as close as possible to where it's used
- Use server components for initial state
- Implement proper loading states

## Common Issues

### 1. useState in Server Component

```tsx
// ❌ Wrong
export default function Page() {
  const [state, setState] = useState() // Error!
}

// ✅ Correct
'use client'
export default function Page() {
  const [state, setState] = useState()
}
```

### 2. Browser APIs in Server Component

```tsx
// ❌ Wrong
export default function Page() {
  useEffect(() => {
    window.addEventListener() // Error!
  }, [])
}

// ✅ Correct
'use client'
export default function Page() {
  useEffect(() => {
    window.addEventListener()
  }, [])
}
```

### 3. Mixed Usage

```tsx
// ❌ Wrong
export default function Page() {
  // Server-side data fetching
  const data = await fetchData()
  
  // Client-side state (This will error!)
  const [state, setState] = useState()
}

// ✅ Correct
// page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData()
  return <ClientComponent initialData={data} />
}

// client-component.tsx
'use client'
export function ClientComponent({ initialData }) {
  const [state, setState] = useState(initialData)
}
```

## Debugging Tips

### 1. Server Component Issues

- Check for client-side APIs usage
- Verify data fetching patterns
- Review component hierarchy

### 2. Client Component Issues

- Verify 'use client' directive
- Check hook usage rules
- Monitor browser console

### 3. Performance Issues

- Analyze component split
- Check bundle size
- Monitor client-side JavaScript

## Migration Strategies

### 1. From Client to Server

1. Remove 'use client' directive
2. Move interactive parts to client components
3. Pass necessary props

### 2. From Server to Client

1. Add 'use client' directive
2. Move data fetching to parent
3. Implement proper state management

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/blog/2020/12/21/data-fetching-with-react-server-components)
- [Performance Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing)
