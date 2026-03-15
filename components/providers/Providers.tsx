'use client'

import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { NewsletterPopup } from '@/components/ui/NewsletterPopup'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { useCartStore } from '@/lib/store/cart'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  return (
    <>
      {children}
      <Toaster />
      <NewsletterPopup />
      <CookieBanner />
    </>
  )
}
