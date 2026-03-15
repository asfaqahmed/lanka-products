'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  const subtotal = getTotalPrice()
  const discount = promoApplied ? promoDiscount : 0
  const total = subtotal - discount

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setPromoDiscount(subtotal * 0.1)
      setPromoApplied(true)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-cinnamon/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-cinnamon" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-charcoal mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added any Sri Lankan treasures yet. Let&apos;s fix that!
          </p>
          <Link href="/shop">
            <Button variant="cinnamon" size="lg">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-charcoal mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Clear cart
              </button>
            </div>

            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 border border-border flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">🌿</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={item.type === 'product' ? `/products/${item.slug}` : `/gift-boxes/${item.slug}`}
                        className="font-semibold text-charcoal text-sm md:text-base hover:text-cinnamon transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs text-muted-foreground capitalize">{item.type === 'gift_box' ? 'Gift Box' : 'Product'}</span>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 py-1.5 font-medium text-sm min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-cinnamon">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link href="/shop" className="inline-flex items-center gap-2 text-cinnamon hover:text-cinnamon-dark text-sm font-medium mt-2">
              <ArrowRight className="h-4 w-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold text-charcoal mb-5">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm text-tea">
                    <span>Promo (WELCOME10)</span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-tea font-medium text-sm">Calculated at checkout</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between">
                  <span className="font-bold text-charcoal">Estimated Total</span>
                  <span className="font-bold text-cinnamon text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {subtotal < 150 && (
                <div className="bg-tea/10 rounded-lg px-4 py-3 mb-4">
                  <p className="text-tea text-sm font-medium">
                    Add {formatPrice(150 - subtotal)} more for free shipping to USA!
                  </p>
                  <div className="mt-2 bg-tea/20 rounded-full h-1.5">
                    <div
                      className="bg-tea rounded-full h-1.5 transition-all"
                      style={{ width: `${(subtotal / 150) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Promo Code */}
              <div className="mb-5">
                <label className="text-xs font-medium text-charcoal block mb-2">
                  <Tag className="h-3.5 w-3.5 inline mr-1" />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    disabled={promoApplied}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cinnamon bg-white disabled:bg-gray-50"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode}
                  >
                    Apply
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-tea text-xs mt-1">Code applied! You saved {formatPrice(promoDiscount)}</p>
                )}
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button variant="cinnamon" size="lg" className="w-full text-base font-bold">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <p className="text-center text-xs text-muted-foreground mt-3">
                Secure checkout powered by PayHere
              </p>

              {/* Payment Icons */}
              <div className="flex justify-center gap-2 mt-3">
                {['VISA', 'MC', 'AMEX'].map((method) => (
                  <div key={method} className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 font-medium">
                    {method}
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
