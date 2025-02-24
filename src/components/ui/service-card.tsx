import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Icon } from './icon'
import { Button } from './button'

export interface ServiceFeature {
  title: string
  description: string
}

export interface ServiceCardProps {
  title: string
  description: string
  icon: string
  features: ServiceFeature[]
  ctaLabel?: string
  onCtaClick?: () => void
  className?: string
}

export function ServiceCard({
  title,
  description,
  icon,
  features,
  ctaLabel = 'Learn More',
  onCtaClick,
  className,
}: ServiceCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon name={icon} className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <Icon
                  name="check-circle"
                  className="mr-2 h-5 w-5 text-green-600 shrink-0 mt-0.5"
                />
                <div>
                  <div className="font-medium">{feature.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {onCtaClick && (
            <Button
              onClick={onCtaClick}
              className="w-full"
              variant="outline"
            >
              {ctaLabel}
              <Icon name="arrow-right" className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 