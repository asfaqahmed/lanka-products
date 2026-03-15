'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShieldCheck, Truck, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PayhereButton } from '@/components/checkout/PayhereButton'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import type { PayhereConfig } from '@/lib/payhere'

const SUPPORTED_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'NL', name: 'Netherlands' },
]

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone number required'),
  addressLine1: z.string().min(5, 'Address required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().optional(),
  postalCode: z.string().min(3, 'Postal code required'),
  countryCode: z.string().min(2, 'Country required'),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface ShippingRate {
  rate: number
  min_days: number
  max_days: number
  free_shipping_threshold: number | null
  country_name: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [shippingRate, setShippingRate] = useState<ShippingRate | null>(null)
  const [isLoadingShipping, setIsLoadingShipping] = useState(false)
  const [payhereConfig, setPayhereConfig] = useState<PayhereConfig | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderStep, setOrderStep] = useState<'form' | 'payment'>('form')

  const subtotal = getTotalPrice()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { countryCode: 'US' },
  })

  const selectedCountry = watch('countryCode')

  useEffect(() => {
    if (!selectedCountry) return

    const fetchShipping = async () => {
      setIsLoadingShipping(true)
      try {
        const res = await fetch(`/api/shipping?country=${selectedCountry}`)
        const data = await res.json()
        setShippingRate(data)
      } catch {
        setShippingRate(null)
      } finally {
        setIsLoadingShipping(false)
      }
    }

    fetchShipping()
  }, [selectedCountry])

  const shippingCost =
    shippingRate
      ? shippingRate.free_shipping_threshold && subtotal >= shippingRate.free_shipping_threshold
        ? 0
        : shippingRate.rate
      : 0

  const total = subtotal + shippingCost

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      router.push('/cart')
      return
    }

    setIsCreatingOrder(true)

    try {
      const countryName =
        SUPPORTED_COUNTRIES.find((c) => c.code === data.countryCode)?.name ||
        data.countryCode

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            type: item.type,
          })),
          shippingAddress: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: countryName,
            countryCode: data.countryCode,
          },
          subtotal,
          shippingCost,
          total,
          notes: data.notes,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create order')
      }

      setPayhereConfig(result.payhereConfig)
      setOrderStep('payment')
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">Checkout</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <span className={orderStep === 'form' ? 'text-cinnamon font-medium' : ''}>1. Shipping Info</span>
          <span>/</span>
          <span className={orderStep === 'payment' ? 'text-cinnamon font-medium' : ''}>2. Payment</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form / Payment */}
          <div className="lg:col-span-2">
            {orderStep === 'form' ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-charcoal mb-5">Contact Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-charcoal block mb-1.5">First Name *</label>
                      <input
                        {...register('firstName')}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-charcoal block mb-1.5">Last Name *</label>
                      <input
                        {...register('lastName')}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-charcoal block mb-1.5">Email *</label>
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-charcoal block mb-1.5">Phone *</label>
                      <input
                        {...register('phone')}
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-charcoal mb-5">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-charcoal block mb-1.5">Country *</label>
                      <select
                        {...register('countryCode')}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon bg-white"
                      >
                        {SUPPORTED_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-charcoal block mb-1.5">Address Line 1 *</label>
                      <input
                        {...register('addressLine1')}
                        placeholder="Street address, P.O. box"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                      />
                      {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-charcoal block mb-1.5">Address Line 2</label>
                      <input
                        {...register('addressLine2')}
                        placeholder="Apartment, suite, unit, etc."
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-charcoal block mb-1.5">City *</label>
                        <input
                          {...register('city')}
                          className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-charcoal block mb-1.5">State / Province</label>
                        <input
                          {...register('state')}
                          placeholder="Optional"
                          className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-charcoal block mb-1.5">Postal / ZIP Code *</label>
                      <input
                        {...register('postalCode')}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                      />
                      {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                    </div>

                    {/* Shipping info */}
                    {shippingRate && (
                      <div className="bg-tea/10 rounded-lg p-3 flex items-start gap-2">
                        <Truck className="h-4 w-4 text-tea mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-tea font-medium">
                            {shippingCost === 0 ? 'Free Shipping!' : `Shipping: ${formatPrice(shippingRate.rate)}`}
                          </p>
                          <p className="text-tea/70 text-xs">
                            Estimated delivery: {shippingRate.min_days}–{shippingRate.max_days} business days to {shippingRate.country_name}
                          </p>
                          {shippingRate.free_shipping_threshold && shippingCost > 0 && (
                            <p className="text-tea/70 text-xs mt-0.5">
                              Free shipping on orders over {formatPrice(shippingRate.free_shipping_threshold)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-charcoal mb-3">Order Notes (Optional)</h2>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Special instructions, gift message, etc."
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="cinnamon"
                  size="lg"
                  className="w-full text-base font-bold"
                  disabled={isCreatingOrder || isLoadingShipping}
                >
                  {isCreatingOrder ? 'Processing...' : 'Continue to Payment'}
                </Button>
              </form>
            ) : (
              /* Payment Step */
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-xl font-serif font-bold text-charcoal mb-2">Complete Your Payment</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  You&apos;ll be redirected to PayHere&apos;s secure payment gateway to complete your purchase.
                </p>

                <div className="bg-cream rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-tea" />
                    <span className="font-semibold text-charcoal text-sm">Secure Payment</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Your payment is processed securely by PayHere. We accept Visa, Mastercard, American Express, and more.
                  </p>
                </div>

                {payhereConfig && (
                  <PayhereButton config={payhereConfig} />
                )}

                <button
                  onClick={() => setOrderStep('form')}
                  className="w-full mt-3 text-sm text-muted-foreground hover:text-charcoal transition-colors"
                >
                  ← Back to shipping info
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-charcoal mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
                      )}
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-cinnamon text-white rounded-full text-xs flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-charcoal">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {isLoadingShipping ? '...' : shippingCost === 0 ? (
                      <span className="text-tea">Free</span>
                    ) : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-cinnamon">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                {[
                  { icon: Package, text: 'Authentic guaranteed' },
                  { icon: Truck, text: 'Tracked international shipping' },
                  { icon: ShieldCheck, text: 'Secure payment' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="h-3.5 w-3.5 text-tea flex-shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
