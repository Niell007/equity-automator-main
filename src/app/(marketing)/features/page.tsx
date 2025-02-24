import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  FileCheck, 
  BarChart, 
  Shield, 
  Bell, 
  Users, 
  Clock,
  CheckCircle 
} from "lucide-react"

const features = [
  {
    title: "Automated EE Reporting",
    description: "Generate EEA2, EEA4, and EEA13 reports automatically with real-time data validation and compliance checks.",
    icon: <FileCheck className="h-6 w-6" />,
  },
  {
    title: "Real-time Analytics",
    description: "Monitor your workforce demographics, track progress towards EE goals, and identify areas for improvement.",
    icon: <BarChart className="h-6 w-6" />,
  },
  {
    title: "Compliance Monitoring",
    description: "Stay compliant with South African Employment Equity regulations with built-in compliance checks and alerts.",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "Smart Notifications",
    description: "Receive timely alerts for deadlines, compliance issues, and required actions to maintain EE compliance.",
    icon: <Bell className="h-6 w-6" />,
  },
  {
    title: "Workforce Management",
    description: "Efficiently manage employee data, track skills development, and monitor succession planning.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Audit Trail",
    description: "Maintain detailed records of all changes and actions for audit purposes and compliance verification.",
    icon: <Clock className="h-6 w-6" />,
  },
]

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
          Features that Empower Compliance
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamline your Employment Equity management with powerful tools designed specifically for South African businesses.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="mb-4 p-2 inline-block rounded-lg bg-primary/10">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-primary/5 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Choose Equity Automator?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Save Time and Resources</h3>
              <p className="text-muted-foreground">Automate manual processes and reduce administrative burden</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Ensure Compliance</h3>
              <p className="text-muted-foreground">Stay up-to-date with latest EE regulations and requirements</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Data-Driven Decisions</h3>
              <p className="text-muted-foreground">Make informed decisions with comprehensive analytics and insights</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Expert Support</h3>
              <p className="text-muted-foreground">Get assistance from EE specialists whenever you need it</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Simplify Your EE Compliance?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Start your journey towards effortless Employment Equity management today.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/demo">Try Live Demo</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 