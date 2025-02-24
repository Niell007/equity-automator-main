'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate login - replace with actual auth logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes - check for admin credentials
      if (formData.email === 'admin@example.com' && formData.password === 'admin') {
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        })
        router.push('/dashboard')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container relative flex h-[800px] flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              name="email"
              placeholder="admin@example.com"
              required
              disabled={isLoading}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In to Dashboard
          </Button>
        </form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          For demo purposes use:<br />
          Email: admin@example.com<br />
          Password: admin
        </p>
      </div>
    </div>
  )
} 