import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Employment Equity Compliance{" "}
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Streamline your EE reporting process with our automated system. 
            Compliant with South African labour laws and POPIA.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Equity Automator?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Compliance Guaranteed</h3>
              <p className="text-muted-foreground">
                Stay compliant with the latest Employment Equity regulations and POPIA requirements.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Easy Collaboration</h3>
              <p className="text-muted-foreground">
                Multiple user roles, real-time updates, and seamless team collaboration.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Automated Reporting</h3>
              <p className="text-muted-foreground">
                Generate EEA2 and EEA4 reports automatically with accurate calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to Transform Your EE Reporting?</h2>
          <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
            Join hundreds of companies already using Equity Automator to streamline their compliance process.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
