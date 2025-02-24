'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"
import { 
  fadeIn, 
  slideUp, 
  staggerChildren, 
  cardHover,
  scrollReveal 
} from "@/lib/animations"
import { ContactForm } from "./contact-form"

const contactMethods = [
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone Support",
    description: "Available during South African business hours",
    value: "+27 (0) 87 123 4567",
    action: "Call now",
    href: "tel:+27871234567",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    description: "Our team typically responds within 2 hours",
    value: "support@equityautomator.co.za",
    action: "Send email",
    href: "mailto:support@equityautomator.co.za",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Live Chat",
    description: "Available 24/7 for urgent assistance",
    value: "Start a conversation",
    action: "Chat now",
    href: "#chat",
  },
]

const officeLocations = [
  {
    city: "Johannesburg",
    address: "88 Katherine Street, Sandton, 2196",
    hours: "Mon-Fri: 8:00 - 17:00 SAST",
  },
  {
    city: "Cape Town",
    address: "100 Bree Street, CBD, 8001",
    hours: "Mon-Fri: 8:00 - 17:00 SAST",
  },
]

export default function ContactPage() {
  return (
    <motion.div 
      className="container mx-auto px-4 py-16"
      variants={staggerChildren}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        variants={fadeIn}
      >
        <motion.h1 
          className="text-4xl font-bold tracking-tight sm:text-6xl mb-4"
          variants={slideUp}
        >
          Get in Touch
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          variants={slideUp}
        >
          Our Employment Equity specialists are here to help you achieve compliance and transformation goals
        </motion.p>
      </motion.div>

      {/* Contact Methods Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        variants={staggerChildren}
      >
        {contactMethods.map((method) => (
          <motion.div
            key={method.title}
            className="p-6 rounded-lg border bg-card text-card-foreground hover:shadow-lg transition-shadow"
            variants={scrollReveal}
            whileHover={cardHover}
          >
            <div className="mb-4 p-2 inline-block rounded-lg bg-primary/10">
              {method.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {method.description}
            </p>
            <p className="font-medium mb-4">{method.value}</p>
            <Button asChild variant="outline" className="w-full">
              <Link href={method.href}>{method.action}</Link>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Office Locations */}
      <motion.div 
        className="mb-16"
        variants={fadeIn}
      >
        <motion.h2 
          className="text-3xl font-bold text-center mb-8"
          variants={slideUp}
        >
          Our Offices
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerChildren}
        >
          {officeLocations.map((office) => (
            <motion.div
              key={office.city}
              className="p-6 rounded-lg border bg-card text-card-foreground hover:shadow-lg transition-shadow"
              variants={scrollReveal}
              whileHover={cardHover}
            >
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">{office.city}</h3>
                  <p className="text-muted-foreground mb-2">{office.address}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {office.hours}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Contact Form Section */}
      <motion.div 
        className="max-w-2xl mx-auto"
        variants={fadeIn}
      >
        <motion.div 
          className="text-center mb-8"
          variants={slideUp}
        >
          <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
          <p className="text-muted-foreground">
            Have questions about Employment Equity compliance? We're here to help.
          </p>
        </motion.div>
        <ContactForm />
      </motion.div>
    </motion.div>
  )
} 