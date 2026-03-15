'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitted(true)
    setIsLoading(false)
  }

  return (
    <section className="py-16 md:py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-cinnamon/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-7 w-7 text-cinnamon" />
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-3">
            Stay Connected with Ceylon
          </h2>
          <p className="text-muted-foreground text-lg mb-2">
            Get exclusive offers, new product launches, and stories from the island.
          </p>
          <p className="text-tea font-medium text-sm mb-8">
            Join 5,000+ subscribers and get 10% off your first order!
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-3 bg-tea/10 text-tea rounded-xl px-6 py-4">
              <CheckCircle className="h-6 w-6 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold">Welcome to the Lanka Products family!</p>
                <p className="text-sm text-tea/80">Check your email for your discount code.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon text-sm"
              />
              <Button
                type="submit"
                variant="cinnamon"
                disabled={isLoading}
                className="shrink-0"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
