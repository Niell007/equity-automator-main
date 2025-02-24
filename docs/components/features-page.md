# Features Page Documentation

## Overview

The Features page showcases the key capabilities of the Equity Automator platform, specifically tailored for South African Employment Equity compliance.

## Component Structure

### 1. Hero Section

- Main headline highlighting compliance empowerment
- Subheading focused on South African business context
- Responsive text sizing for different screen sizes

### 2. Features Grid

```typescript
const features = [
  {
    title: string,
    description: string,
    icon: ReactNode
  }
]
```

- 6 key features displayed in a responsive grid
- Each feature card includes:
  - Icon with primary color background
  - Title
  - Description
- Grid adjusts from 1 to 3 columns based on screen size

### 3. Benefits Section

- 4 key benefits highlighting platform advantages
- Each benefit includes:
  - CheckCircle icon
  - Benefit title
  - Description
- Responsive 2-column grid on larger screens

### 4. Call-to-Action Section

- Compelling headline
- Two action buttons:
  - Primary: "Try Live Demo"
  - Secondary: "Contact Sales"

## Styling

- Uses Tailwind CSS for responsive design
- Consistent color scheme using CSS variables
- Responsive padding and margins
- Card-based layout for feature presentation

## Usage

```typescript
import FeaturesPage from "@/app/(marketing)/features/page"
```

## Dependencies

- @/components/ui/button
- lucide-react (for icons)
- next/link

## Responsive Behavior

- Mobile: Single column layout
- Tablet: Two column grid
- Desktop: Three column grid for features

## Best Practices

1. Keep feature descriptions concise and benefit-focused
2. Ensure icons are relevant to feature descriptions
3. Maintain consistent spacing and alignment
4. Use semantic HTML for accessibility

## Related Components

- Button
- Link
- Layout components
