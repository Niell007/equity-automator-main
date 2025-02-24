# UI Components

This document outlines the core UI components used throughout the Equity Automator application.

## Table of Contents

1. [Data Display](#data-display)
   - [StatCard](#statcard)
   - [DataTable](#datatable)
2. [Navigation](#navigation)
3. [Forms](#forms)
4. [Feedback](#feedback)
5. [Layout](#layout)

## Data Display

### StatCard

The `StatCard` component displays key metrics with optional trends and icons.

```typescript
import { StatCard } from "@/components/ui/stat-card"
import { Users } from "lucide-react"

// Basic usage
<StatCard
  title="Total Employees"
  value="1,234"
  description="Active employees"
  icon={Users}
/>

// With trend
<StatCard
  title="Diversity Score"
  value="78%"
  description="Overall rating"
  icon={TrendingUp}
  variant="primary"
  trend={{ value: 8, isPositive: true }}
/>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| title | string | Card title |
| value | string \| number | Main value to display |
| description | string | Optional description |
| icon | LucideIcon | Optional icon component |
| variant | 'default' \| 'primary' \| 'success' \| 'warning' \| 'destructive' | Card style variant |
| trend | { value: number, isPositive: boolean } | Optional trend indicator |

### DataTable

The `DataTable` component provides a powerful interface for displaying and managing tabular data.

```typescript
import { DataTable } from "@/components/ui/data-table"
import { type ColumnDef } from "@tanstack/react-table"

// Define columns
const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
]

// Usage
<DataTable
  columns={columns}
  data={data}
  searchKey="name"
/>
```

#### Features

- Sorting
- Filtering
- Pagination
- Search
- Row selection
- Responsive design

## Navigation

### Sidebar Navigation

```typescript
const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  // ...
]

// Usage in layout
<nav className="space-y-1 p-4">
  {navigation.map((item) => (
    <Link
      key={item.name}
      href={item.href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
    >
      <item.icon className="h-4 w-4" />
      {item.name}
    </Link>
  ))}
</nav>
```

## Forms

### Input Components

```typescript
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label>Email</Label>
  <Input type="email" placeholder="Enter your email" />
</div>
```

### Select Component

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

## Feedback

### Button States

```typescript
import { Button } from "@/components/ui/button"

// Variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
```

### Status Indicators

```typescript
<span className={cn(
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
  status === "Active" ? "bg-green-100 text-green-700" :
  status === "Pending" ? "bg-yellow-100 text-yellow-700" :
  "bg-red-100 text-red-700"
)}>
  {status}
</span>
```

## Layout

### Card Component

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Tabs Component

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

## Best Practices

1. **Component Composition**
   - Keep components focused and single-responsibility
   - Use composition over inheritance
   - Leverage prop drilling for shallow component trees

2. **Performance**
   - Memoize callbacks and values when needed
   - Use dynamic imports for large components
   - Implement proper loading states

3. **Accessibility**
   - Include ARIA labels
   - Ensure keyboard navigation
   - Maintain proper contrast ratios

4. **Responsive Design**
   - Use Tailwind breakpoints consistently
   - Test on multiple screen sizes
   - Implement mobile-first approach

## Common Patterns

### Loading States

```typescript
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    "Submit"
  )}
</Button>
```

### Error Handling

```typescript
{error && (
  <p className="text-sm text-destructive mt-2">
    {error.message}
  </p>
)}
```

### Conditional Rendering

```typescript
{data ? (
  <DataView data={data} />
) : (
  <EmptyState />
)}
```

## Theme Integration

Components automatically integrate with the theme system using CSS variables:

```css
.component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border-color: hsl(var(--border));
}
```

## Next Steps

1. Review the [Layout Components](./layout.md) documentation
2. Check the [Form Components](./form.md) documentation
3. Explore the [Data Display Components](./data-display.md) documentation
