'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import va from '@vercel/analytics'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
    va.track('pageview', { url })
  }, [pathname, searchParams])

  return null
} 