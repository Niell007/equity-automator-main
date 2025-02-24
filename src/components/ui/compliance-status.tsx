import { cn } from '@/lib/utils'
import { Icon, IconName } from './icon'

export type ComplianceStatus = 'compliant' | 'pending' | 'non-compliant' | 'expiring'

export interface ComplianceStatusProps {
  status: ComplianceStatus
  label?: string
  daysRemaining?: number
  className?: string
}

export function ComplianceStatus({
  status,
  label,
  daysRemaining,
  className,
}: ComplianceStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'compliant':
        return {
          icon: 'check-circle' as IconName,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        }
      case 'pending':
        return {
          icon: 'clock' as IconName,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        }
      case 'expiring':
        return {
          icon: 'alert-triangle' as IconName,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
        }
      case 'non-compliant':
        return {
          icon: 'x-circle' as IconName,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div
      className={cn(
        'flex items-center space-x-2 rounded-md border px-3 py-2',
        config?.bgColor,
        config?.borderColor,
        className
      )}
    >
      <Icon name={config?.icon} className={cn('h-5 w-5', config?.color)} />
      <div className="flex flex-col">
        <span className={cn('text-sm font-medium', config?.color)}>
          {label || status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        {daysRemaining !== undefined && (
          <span className="text-xs text-muted-foreground">
            {daysRemaining} days remaining
          </span>
        )}
      </div>
    </div>
  )
} 