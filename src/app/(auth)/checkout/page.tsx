'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { loadStripe } from 'stripe'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const priceId = searchParams.get('priceId')

  useEffect(() => {
    const initCheckout = async () => {
      try {
        setIsLoading(true)
        
        // Create a checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            successUrl: `${window.location.origin}/dashboard`,
            cancelUrl: `${window.location.origin}/pricing`,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create checkout session')
        }

        const { sessionId } = await response.json()

        // Load Stripe
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        
        if (!stripe) {
          throw new Error('Failed to load Stripe')
        }

        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        })

        if (error) {
          throw error
        }

      } catch (err) {
        setError('Failed to initialize payment. Please try again.')
        setIsLoading(false)
      }
    }

    if (priceId) {
      initCheckout()
    } else {
      setError('Invalid price ID')
      setIsLoading(false)
    }
  }, [priceId])

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.href = '/pricing'}>
          Return to Pricing
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Initializing checkout...
        </p>
      </div>
    )
  }

  return null
} 