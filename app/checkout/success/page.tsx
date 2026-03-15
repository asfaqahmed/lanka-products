import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SuccessPageProps {
  searchParams: { order_id?: string }
}

export default function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams.order_id

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-tea/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-14 w-14 text-tea" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-3">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          Thank you for your order! Your Sri Lankan treasures are on their way.
        </p>

        {/* Order Number */}
        {orderId && (
          <div className="inline-flex items-center gap-2 bg-white border border-border rounded-xl px-6 py-3 mt-4 mb-6">
            <Package className="h-5 w-5 text-cinnamon" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Order Number</p>
              <p className="font-bold text-cinnamon text-lg">{orderId}</p>
            </div>
          </div>
        )}

        {/* Delivery Estimate */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-8 text-left">
          <h2 className="font-semibold text-charcoal mb-4">What happens next?</h2>
          <div className="space-y-4">
            {[
              {
                icon: '📧',
                title: 'Confirmation Email',
                description: 'Check your inbox for a detailed order confirmation.',
                status: 'done',
              },
              {
                icon: '📦',
                title: 'Order Processing',
                description: 'We\'re carefully packing your authentic Sri Lankan products.',
                status: 'in_progress',
              },
              {
                icon: '✈️',
                title: 'International Shipping',
                description: 'Your order will be shipped within 2–3 business days.',
                status: 'pending',
              },
              {
                icon: '🏠',
                title: 'Delivery',
                description: 'Estimated delivery in 7–18 business days depending on your location.',
                status: 'pending',
              },
            ].map((step) => (
              <div key={step.title} className="flex gap-3">
                <div className="text-2xl w-8 flex-shrink-0">{step.icon}</div>
                <div>
                  <p className={`font-semibold text-sm ${
                    step.status === 'done' ? 'text-tea' : 'text-charcoal'
                  }`}>
                    {step.title}
                    {step.status === 'done' && <span className="ml-2 text-tea text-xs">✓</span>}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email notice */}
        <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-4 py-3 mb-8">
          <Mail className="h-5 w-5 text-gold-dark flex-shrink-0" />
          <p className="text-sm text-charcoal/80">
            A confirmation email has been sent with your order details and tracking information.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button variant="cinnamon" size="lg">
              <Package className="mr-2 h-4 w-4" />
              Track My Order
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Questions? Contact us at{' '}
          <a href="mailto:hello@lankaproducts.com" className="text-cinnamon hover:underline">
            hello@lankaproducts.com
          </a>
        </p>
      </div>
    </div>
  )
}
