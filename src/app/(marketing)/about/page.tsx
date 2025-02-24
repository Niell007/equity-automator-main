import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Users, 
  LineChart, 
  Shield, 
  Globe,
  Award,
  Heart
} from "lucide-react"

const stats = [
  {
    value: "1000+",
    label: "Companies Served",
  },
  {
    value: "500K+",
    label: "Employees Managed",
  },
  {
    value: "98%",
    label: "Compliance Rate",
  },
  {
    value: "24/7",
    label: "Support Available",
  },
]

const values = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Compliance Excellence",
    description: "We ensure your business meets and exceeds Employment Equity requirements with precision and confidence.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Empowering Transformation",
    description: "Supporting South African businesses in creating diverse, equitable workplaces that drive success.",
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Data-Driven Progress",
    description: "Using advanced analytics to track and accelerate your Employment Equity journey.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Local Expertise",
    description: "Deep understanding of South African Employment Equity legislation and business landscape.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Quality Service",
    description: "Committed to providing exceptional support and innovative solutions to our clients.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Social Impact",
    description: "Contributing to a more inclusive and equitable South African workforce.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
          Transforming Workplace Equity in South Africa
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're dedicated to helping South African businesses achieve meaningful employment equity through innovative technology and expert guidance.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Mission Section */}
      <div className="bg-primary/5 rounded-lg p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-8">
            To simplify Employment Equity compliance while fostering genuine transformation in South African workplaces. We believe technology can drive positive change in achieving workplace equity and diversity.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Join Our Mission</Link>
          </Button>
        </div>
      </div>

      {/* Values Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="p-6 rounded-lg border bg-card text-card-foreground"
            >
              <div className="mb-4 p-2 inline-block rounded-lg bg-primary/10">
                {value.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Our Team</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          We're a diverse team of Employment Equity specialists, technology experts, and business professionals committed to transforming South African workplaces.
        </p>
        <Button variant="outline" asChild size="lg">
          <Link href="/careers">Join Our Team</Link>
        </Button>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Workplace?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Start your Employment Equity journey with us today.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/demo">Try Live Demo</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 