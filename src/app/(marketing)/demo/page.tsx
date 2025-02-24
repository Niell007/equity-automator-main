'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BarChart,
  Users,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Play,
  Loader2
} from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

const demoFeatures = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Workforce Demographics",
    description: "Experience real-time workforce analysis with sample data",
    action: "Try Demographics",
    href: "#demographics",
    explanation: "View interactive charts showing employee distribution across occupational levels, gender, and race groups"
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: "EE Analytics",
    description: "Explore interactive charts and compliance metrics",
    action: "View Analytics",
    href: "#analytics",
    explanation: "Analyze key Employment Equity metrics and track progress towards your goals"
  },
  {
    icon: <FileCheck className="h-6 w-6" />,
    title: "Report Generation",
    description: "Generate sample EEA2 and EEA4 reports instantly",
    action: "Generate Reports",
    href: "#reports",
    explanation: "Create Department of Labour compliant reports with automated validation"
  },
]

const demoSteps = [
  {
    number: "01",
    title: "Explore the Dashboard",
    description: "Navigate through our intuitive dashboard designed for Employment Equity management",
  },
  {
    number: "02",
    title: "Analyze Sample Data",
    description: "View pre-populated data showcasing workforce demographics and compliance metrics",
  },
  {
    number: "03",
    title: "Generate Reports",
    description: "Experience automated report generation with built-in validation",
  },
  {
    number: "04",
    title: "Test Features",
    description: "Try out key features like data import, analytics, and compliance monitoring",
  },
]

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const handleDemoStart = async () => {
    setIsLoading(true)
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    window.location.href = "#demographics"
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
          Experience Equity Automator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Try our Employment Equity management platform with sample data and see how it can transform your compliance process
        </p>
        <Button 
          size="lg" 
          className="gap-2 min-w-[200px]"
          onClick={handleDemoStart}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading Demo...
            </>
          ) : (
            <>
              Start Demo <Play className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Demo Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {demoFeatures.map((feature) => (
          <motion.div
            key={feature.title}
            className="p-6 rounded-lg border bg-card text-card-foreground hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setActiveFeature(feature.title)}
            onHoverEnd={() => setActiveFeature(null)}
          >
            <div className="mb-4 p-2 inline-block rounded-lg bg-primary/10">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {feature.description}
            </p>
            {activeFeature === feature.title && (
              <motion.p 
                className="text-xs text-muted-foreground mb-4 italic"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {feature.explanation}
              </motion.p>
            )}
            <Button 
              asChild 
              variant="outline" 
              className="w-full group"
            >
              <Link href={feature.href}>
                {feature.action}
                <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">How the Demo Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {demoSteps.map((step) => (
            <motion.div 
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: parseInt(step.number) * 0.1 }}
            >
              <div className="mb-4">
                <span className="text-4xl font-bold text-primary/20">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {step.number !== "04" && (
                <ArrowRight className="hidden lg:block h-6 w-6 text-primary/30 absolute -right-4 top-8" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demo Environment Notice */}
      <motion.div 
        className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-6 mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex gap-4">
          <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">Demo Environment</h3>
            <p className="text-sm text-muted-foreground">
              This is a demonstration environment with sample data. No real data will be stored or processed. 
              For a full featured experience with your organization's data, please contact our sales team.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your EE Management?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Experience how Equity Automator can streamline your compliance process
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="group">
            <Link href="/pricing">
              View Pricing
              <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="group">
            <Link href="/contact">
              Contact Sales
              <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
} 