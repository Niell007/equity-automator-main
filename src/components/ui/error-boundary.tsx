import { Component, ErrorInfo, ReactNode } from "react"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Button } from "./button"
import { errorShake } from "@/lib/animations"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  resetErrorBoundary?: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-4">
      <motion.div
        variants={errorShake}
        animate="animate"
        className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive"
      >
        <AlertTriangle className="h-6 w-6" />
      </motion.div>
      <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
      <p className="mb-4 max-w-md text-sm text-muted-foreground">
        {error?.message || "An unexpected error occurred. Please try again later."}
      </p>
      {resetErrorBoundary && (
        <Button onClick={resetErrorBoundary} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  )
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
} 