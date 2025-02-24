# Contact Page Documentation

## Overview

The Contact page provides multiple channels for users to reach the Equity Automator team, featuring South African business context, localized contact information, and modern animations.

## Implementation Details

### File Structure

src/app/(marketing)/contact/
├── page.tsx           # Main Contact page component
└── contact-form.tsx   # Client-side form component

### Components

#### 1. ContactPage (`page.tsx`)

- Client component (uses `'use client'` directive)
- Implements page layout and animations
- Manages contact methods and office locations
- Integrates the ContactForm component

```typescript
interface ContactMethod {
  icon: ReactNode
  title: string
  description: string
  value: string
  action: string
  href: string
}

interface OfficeLocation {
  city: string
  address: string
  hours: string
}
```

#### 2. ContactForm (`contact-form.tsx`)

- Client component for form handling
- Manages form state and submission
- Implements loading states and animations

```typescript
interface FormState {
  isSubmitting: boolean
}
```

### Animations

Using Framer Motion for smooth transitions and interactions:

```typescript
const animations = {
  fadeIn: { opacity: [0, 1] },
  slideUp: { y: [20, 0] },
  cardHover: { scale: 1.02 },
  scrollReveal: { opacity: 0, y: 50 },
  staggerChildren: {
    animate: { transition: { staggerChildren: 0.1 } }
  }
}
```

## Features

### 1. Contact Methods

- Phone support with South African business hours
- Email support with response time expectations
- Live chat availability
- Interactive cards with hover effects

### 2. Office Locations

- Major South African cities (Johannesburg, Cape Town)
- Business hours in SAST
- Physical addresses
- Interactive location cards

### 3. Contact Form

- Responsive layout
- Form validation
- Loading states
- Animated feedback
- Field disabled states during submission

## Styling

### 1. Layout

- Responsive grid system
- Mobile-first design
- Proper spacing and alignment
- Container constraints

### 2. Components

- Card designs with hover effects
- Form input styling
- Button states
- Loading indicators

### 3. Animations

- Page entry animations
- Scroll reveal effects
- Hover interactions
- Loading state transitions

## Best Practices

### 1. Performance

- Component splitting for better code splitting
- Optimized animations
- Proper loading states
- Efficient re-renders

### 2. Accessibility

- Semantic HTML structure
- ARIA labels
- Focus management
- Loading state announcements
- Keyboard navigation

### 3. SEO

- Proper meta tags
- Structured data
- Local business schema
- Contact information markup

### 4. Error Handling

- Form validation
- Submission error handling
- Loading state management
- User feedback

## Usage Example

```tsx
// In a page or component
import ContactPage from '@/app/(marketing)/contact/page'

export default function MarketingLayout() {
  return (
    <main>
      <ContactPage />
    </main>
  )
}
```

## Dependencies

```json
{
  "framer-motion": "^11.18.0",
  "lucide-react": "^0.471.1",
  "next": "15.1.4",
  "react": "^19.0.0"
}
```

## Related Components

- Button
- Loading
- ErrorBoundary
- Motion components

## Testing Considerations

1. Form submission
2. Validation logic
3. Loading states
4. Animation triggers
5. Responsive behavior
6. Accessibility compliance

## Future Enhancements

1. Form validation with zod/yup
2. Success/error notifications
3. Form analytics
4. Enhanced animations
5. Integration with CRM
6. Auto-complete for company field

## Troubleshooting

1. Animation issues:
   - Check Framer Motion imports
   - Verify animation variants
2. Form issues:
   - Validate form state
   - Check submission logic
3. Loading states:
   - Verify state management
   - Check disabled properties

## Support

For issues or questions:

- Technical: <support@equityautomator.co.za>
- Documentation: <docs@equityautomator.co.za>
