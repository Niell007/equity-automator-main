'use client'

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Basic",
    id: "basic",
    priceMonthly: "R249",
    priceAnnual: "R2,495",
    description: "Essential EE compliance tools for small businesses",
    features: [
      "Basic EE reporting",
      "Workforce demographics tracking",
      "Standard compliance alerts",
      "Email support",
      "Basic analytics dashboard",
    ],
    stripePriceId: "price_basic", // Replace with your Stripe price ID
  },
  {
    name: "Professional",
    id: "pro",
    priceMonthly: "R349",
    priceAnnual: "R3,495",
    description: "Advanced features for growing organizations",
    features: [
      "Everything in Basic, plus:",
      "Advanced EE reporting",
      "Custom analytics",
      "Priority support",
      "Compliance monitoring",
      "Team collaboration tools",
    ],
    stripePriceId: "price_pro", // Replace with your Stripe price ID
    popular: true,
  },
  {
    name: "Enterprise",
    id: "enterprise",
    priceMonthly: "R499",
    priceAnnual: "R4,995",
    description: "Complete solution for large enterprises",
    features: [
      "Everything in Professional, plus:",
      "Custom implementation",
      "Dedicated account manager",
      "API access",
      "Advanced security features",
      "Custom integrations",
      "24/7 phone support",
    ],
    stripePriceId: "price_enterprise", // Replace with your Stripe price ID
  },
]

export default function PricingPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Choose the perfect plan for your Employment Equity compliance needs. All plans include our core features with varying levels of support and customization.
          </p>
        </div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 dark:ring-gray-800 xl:p-10 ${
                tier.popular
                  ? "bg-gray-900 text-white dark:bg-blue-600"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h2
                  className={`text-lg font-semibold leading-8 ${
                    tier.popular ? "text-white" : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {tier.name}
                </h2>
                {tier.popular && (
                  <span className="rounded-full bg-blue-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                    Most popular
                  </span>
                )}
              </div>
              <p
                className={`mt-4 text-sm leading-6 ${
                  tier.popular ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={`text-4xl font-bold tracking-tight ${
                    tier.popular ? "text-white" : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {tier.priceMonthly}
                </span>
                <span
                  className={`text-sm font-semibold leading-6 ${
                    tier.popular ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  /month
                </span>
              </p>
              <p
                className={`mt-1 text-sm ${
                  tier.popular ? "text-gray-300" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {tier.priceAnnual} billed annually
              </p>
              <Button
                className={`mt-6 w-full ${
                  tier.popular
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                }`}
                asChild
              >
                <Link href={`/checkout?priceId=${tier.stripePriceId}`}>
                  Get started
                </Link>
              </Button>
              <ul
                className={`mt-8 space-y-3 text-sm leading-6 ${
                  tier.popular ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className={`h-6 w-5 flex-none ${
                        tier.popular ? "text-white" : "text-blue-600 dark:text-blue-400"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-base text-gray-600 dark:text-gray-400">
            Need a custom solution? {" "}
            <Link href="/contact" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 