import React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: 'default' | 'success' | 'warning' | 'error'
    size?: 'default' | 'sm' | 'lg'
  }
>(({ className, value, variant = 'default', size = 'default', ...props }, ref) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-600'
      case 'warning':
        return 'bg-yellow-600'
      case 'error':
        return 'bg-red-600'
      default:
        return 'bg-primary'
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-2'
      case 'lg':
        return 'h-4'
      default:
        return 'h-3'
    }
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-secondary',
        getSizeClass(),
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 transition-all',
          getVariantClass()
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress } 