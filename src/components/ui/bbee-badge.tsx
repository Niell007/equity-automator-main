import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from './badge'

export interface BBEEBadgeProps {
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'Non-Compliant'
  score?: number
  className?: string
}

export function BBEEBadge({ level, score, className }: BBEEBadgeProps) {
  const getVariant = () => {
    switch (level) {
      case 1:
        return 'success'
      case 2:
      case 3:
        return 'info'
      case 4:
      case 5:
        return 'warning'
      case 6:
      case 7:
      case 8:
        return 'secondary'
      default:
        return 'destructive'
    }
  }

  return (
    <Badge variant={getVariant()} className={cn('font-semibold', className)}>
      {typeof level === 'number' ? `Level ${level}` : level}
      {score && ` (${score} points)`}
    </Badge>
  )
} 