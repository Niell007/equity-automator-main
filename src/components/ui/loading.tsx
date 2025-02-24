import { motion } from "framer-motion"
import { loadingSpinner } from "@/lib/animations"
import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

export function Loading({ size = "md", className, text }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <motion.div
        className={cn(
          "border-4 border-primary/30 border-t-primary rounded-full",
          sizes[size]
        )}
        variants={loadingSpinner}
        animate="animate"
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  )
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loading size="lg" text="Please wait..." />
    </div>
  )
} 