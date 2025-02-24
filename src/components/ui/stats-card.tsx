import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Icon } from './icon'

export interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: string
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return 'trending-up'
      case 'down':
        return 'trending-down'
      default:
        return 'minus'
    }
  }

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <Icon name={icon} className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center space-x-2">
            {trend && (
              <div
                className={cn(
                  'flex items-center text-sm',
                  getTrendColor()
                )}
              >
                <Icon
                  name={getTrendIcon()}
                  className="mr-1 h-4 w-4"
                />
                {trend.value}%
              </div>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 