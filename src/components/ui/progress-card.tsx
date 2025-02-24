import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Progress } from './progress'
import { Icon } from './icon'

export interface ProgressCardProps {
  title: string
  description?: string
  progress: number
  target: number
  icon?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

export function ProgressCard({
  title,
  description,
  progress,
  target,
  icon,
  variant = 'default',
  className,
}: ProgressCardProps) {
  const percentage = Math.min(Math.round((progress / target) * 100), 100)

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && (
          <Icon
            name={icon}
            className={cn(
              'h-4 w-4',
              variant === 'success' && 'text-green-600',
              variant === 'warning' && 'text-yellow-600',
              variant === 'error' && 'text-red-600'
            )}
          />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {progress} / {target}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        <Progress
          value={percentage}
          className="mt-4"
          variant={variant}
        />
      </CardContent>
    </Card>
  )
} 