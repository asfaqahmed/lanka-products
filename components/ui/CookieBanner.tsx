'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, ChevronDown, ChevronUp } from 'lucide-react'

const STORAGE_KEY = 'lp_cookie_consent'

type ConsentState = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

function getStoredConsent(): ConsentState | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function storeConsent(consent: ConsentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const stored = getStoredConsent()
    if (!stored) {
      // Slight delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
    // Apply stored preferences to analytics/marketing
    applyConsent(stored)
  }, [])

  function applyConsent(consent: ConsentState) {
    // If GA is loaded, update consent state
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
      })
    }
  }

  const acceptAll = () => {
    const consent: ConsentState = { necessary: true, analytics: true, marketing: true }
    storeConsent(consent)
    applyConsent(consent)
    setVisible(false)
  }

  const savePreferences = () => {
    const consent: ConsentState = { necessary: true, analytics, marketing }
    storeConsent(consent)
    applyConsent(consent)
    setVisible(false)
  }

  const rejectAll = () => {
    const consent: ConsentState = { necessary: true, analytics: false, marketing: false }
    storeConsent(consent)
    applyConsent(consent)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 animate-in slide-in-from-bottom-4 duration-300"
      role="region"
      aria-label="Cookie consent"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Main row */}
        <div className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cinnamon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cookie className="h-5 w-5 text-cinnamon" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-serif font-bold text-charcoal text-base mb-1">
                We use cookies 🍪
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We use cookies to enhance your browsing experience, analyse site traffic, and personalise content.
                By clicking &quot;Accept All&quot; you consent to our use of cookies.{' '}
                <Link href="/privacy" className="text-cinnamon hover:underline">
                  Privacy Policy
                </Link>
              </p>

              {/* Expanded preferences */}
              {expanded && (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  {/* Necessary */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-charcoal">Necessary Cookies</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Required for the site to function — cart, session, authentication. Cannot be disabled.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-5 bg-tea rounded-full cursor-not-allowed flex items-center justify-end px-0.5">
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-charcoal">Analytics Cookies</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Help us understand how visitors use our site (Google Analytics). No personal data is sold.
                      </p>
                    </div>
                    <button
                      onClick={() => setAnalytics(!analytics)}
                      className={`flex-shrink-0 w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                        analytics ? 'bg-tea justify-end' : 'bg-gray-300 justify-start'
                      }`}
                      aria-label={analytics ? 'Disable analytics cookies' : 'Enable analytics cookies'}
                      role="switch"
                      aria-checked={analytics}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-charcoal">Marketing Cookies</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Used to show relevant ads and track marketing campaign performance.
                      </p>
                    </div>
                    <button
                      onClick={() => setMarketing(!marketing)}
                      className={`flex-shrink-0 w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                        marketing ? 'bg-tea justify-end' : 'bg-gray-300 justify-start'
                      }`}
                      aria-label={marketing ? 'Disable marketing cookies' : 'Enable marketing cookies'}
                      role="switch"
                      aria-checked={marketing}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action row */}
        <div className="px-5 pb-5 md:px-6 md:pb-6 flex flex-wrap items-center gap-2 justify-end border-t border-border pt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-charcoal transition-colors mr-auto"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? 'Hide preferences' : 'Manage preferences'}
          </button>

          <button
            onClick={rejectAll}
            className="text-xs text-muted-foreground hover:text-charcoal border border-border px-3.5 py-2 rounded-lg transition-colors"
          >
            Reject All
          </button>

          {expanded && (
            <button
              onClick={savePreferences}
              className="text-xs font-medium text-charcoal border border-charcoal px-3.5 py-2 rounded-lg hover:bg-charcoal hover:text-white transition-colors"
            >
              Save Preferences
            </button>
          )}

          <button
            onClick={acceptAll}
            className="text-xs font-semibold bg-cinnamon text-white px-4 py-2 rounded-lg hover:bg-cinnamon-dark transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
