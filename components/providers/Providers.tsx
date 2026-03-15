'use client'

import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'
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
    </>
  )
}
