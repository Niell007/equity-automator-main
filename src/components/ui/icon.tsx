import React from 'react'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'

export type IconName = keyof typeof LucideIcons

export interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName
  color?: string
  size?: number | string
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, color, size, className, ...props }, ref) => {
    const LucideIcon = LucideIcons[name]

    if (!LucideIcon) {
      console.warn(`Icon "${name}" not found in Lucide icons`)
      return null
    }

    return (
      <LucideIcon
        ref={ref}
        color={color}
        size={size}
        className={cn('', className)}
        {...props}
      />
    )
  }
)

Icon.displayName = 'Icon' 