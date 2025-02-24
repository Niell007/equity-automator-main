'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { scrollReveal, staggerChildren } from "@/lib/animations"
import { useToast } from "@/components/ui/use-toast"

interface FormData {
  firstName: string
  lastName: string
  email: string
  company: string
  message: string
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  message: ""
}

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success message
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
      })
      
      // Reset form
      setFormData(initialFormData)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again later or contact us directly.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form 
      className="space-y-6"
      variants={staggerChildren}
      onSubmit={handleSubmit}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={scrollReveal}
      >
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            required
            disabled={isSubmitting}
          />
        </div>
      </motion.div>
      <motion.div variants={scrollReveal}>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          required
          disabled={isSubmitting}
        />
      </motion.div>
      <motion.div variants={scrollReveal}>
        <label className="block text-sm font-medium mb-2">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          required
          disabled={isSubmitting}
        />
      </motion.div>
      <motion.div variants={scrollReveal}>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md h-32 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          required
          disabled={isSubmitting}
        ></textarea>
      </motion.div>
      <motion.div variants={scrollReveal}>
        <Button 
          type="submit" 
          size="lg" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </motion.div>
    </motion.form>
  )
} 