'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Gift, Leaf } from 'lucide-react'

const COOKIE_KEY = 'lp_newsletter_dismissed'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days in seconds

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`
}

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed
    if (getCookie(COOKIE_KEY)) return

    // Show after 5 seconds
    const timer = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setVisible(false)
    setCookie(COOKIE_KEY, '1', COOKIE_MAX_AGE)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Simulate API call — replace with your email service integration
    await new Promise((r) => setTimeout(r, 900))
    setSubmitted(true)
    setLoading(false)
    // Dismiss permanently after signup
    setCookie(COOKIE_KEY, '1', 60 * 60 * 24 * 365)
    setTimeout(() => setVisible(false), 3000)
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-300"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-title"
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">

          {/* Header band */}
          <div className="bg-gradient-to-r from-cinnamon to-cinnamon-light p-6 text-white relative">
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-5 w-5 text-gold" />
              <span className="text-gold text-xs font-semibold tracking-wider uppercase">From the Gardens of Ceylon</span>
            </div>
            <h2 id="newsletter-title" className="text-2xl font-serif font-bold leading-tight">
              Get 10% Off Your<br />First Order
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Join our community of Ceylon enthusiasts.
            </p>
          </div>

          {/* Body */}
          <div className="p-6">
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-tea/10 flex items-center justify-center mx-auto mb-3">
                  <Gift className="h-7 w-7 text-tea" />
                </div>
                <h3 className="font-serif font-bold text-charcoal text-lg mb-1">You&apos;re in!</h3>
                <p className="text-muted-foreground text-sm">
                  Check your inbox for your 10% discount code. Welcome to the Lanka Products family!
                </p>
              </div>
            ) : (
              <>
                <ul className="space-y-2 mb-5">
                  {[
                    '10% off your first order',
                    'Exclusive deals on new arrivals',
                    'Stories from our Sri Lankan artisans',
                    'Seasonal gift box previews',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cinnamon text-white font-semibold py-2.5 rounded-lg hover:bg-cinnamon-dark transition-colors text-sm disabled:opacity-70"
                  >
                    {loading ? 'Subscribing…' : 'Claim My 10% Discount'}
                  </button>
                </form>

                <button
                  onClick={dismiss}
                  className="w-full text-center text-xs text-muted-foreground hover:text-charcoal mt-3 transition-colors"
                >
                  No thanks, I&apos;ll pay full price
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
