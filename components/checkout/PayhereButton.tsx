'use client'

import { useRef, useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PayhereConfig } from '@/lib/payhere'

interface PayhereButtonProps {
  config: PayhereConfig
  onSuccess?: () => void
  className?: string
}

const PAYHERE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.payhere.lk/pay/checkout'
    : 'https://sandbox.payhere.lk/pay/checkout'

export function PayhereButton({ config, className }: PayhereButtonProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Allow loading state to render before form submit
    setTimeout(() => {
      formRef.current?.submit()
    }, 100)
  }

  return (
    <>
      <form
        ref={formRef}
        method="POST"
        action={PAYHERE_URL}
        style={{ display: 'none' }}
      >
        <input type="hidden" name="merchant_id" value={config.merchant_id} />
        <input type="hidden" name="return_url" value={config.return_url} />
        <input type="hidden" name="cancel_url" value={config.cancel_url} />
        <input type="hidden" name="notify_url" value={config.notify_url} />
        <input type="hidden" name="order_id" value={config.order_id} />
        <input type="hidden" name="items" value={config.items} />
        <input type="hidden" name="currency" value={config.currency} />
        <input type="hidden" name="amount" value={config.amount} />
        <input type="hidden" name="first_name" value={config.first_name} />
        <input type="hidden" name="last_name" value={config.last_name} />
        <input type="hidden" name="email" value={config.email} />
        <input type="hidden" name="phone" value={config.phone} />
        <input type="hidden" name="address" value={config.address} />
        <input type="hidden" name="city" value={config.city} />
        <input type="hidden" name="country" value={config.country} />
        <input type="hidden" name="hash" value={config.hash} />
      </form>

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        variant="cinnamon"
        size="lg"
        className={`w-full text-base font-bold ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Redirecting to PayHere...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Securely with PayHere
          </>
        )}
      </Button>
    </>
  )
}
