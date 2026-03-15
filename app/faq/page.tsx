import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQs – Frequently Asked Questions',
  description: 'Find answers to common questions about Lanka Products — shipping, payments, returns, product authenticity, and more.',
}

const faqs = [
  {
    category: 'Orders & Payments',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure PayHere payment gateway. PayHere is a trusted payment processor used across South Asia.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. All payments are processed through PayHere\'s encrypted, PCI-compliant payment gateway. We never store your card details on our servers.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 2 hours of placement, before they enter processing. Please contact us immediately at hello@lankaproducts.com with your order number.',
      },
      {
        q: 'Will I receive an order confirmation?',
        a: 'Yes, you\'ll receive an email confirmation immediately after your order is placed, and another when your order ships with tracking information.',
      },
      {
        q: 'What currency are prices shown in?',
        a: 'All prices are displayed in USD (US Dollars). Your card will be charged in USD regardless of your location.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'Where do you ship to?',
        a: 'We currently ship to the United States, Canada, Australia, United Kingdom, and Netherlands. We ship internationally with tracked shipping on all orders.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Delivery times vary by destination: USA & Canada: 7–14 business days, Australia: 10–18 business days, UK & Netherlands: 5–10 business days. These are estimates — customs processing may add additional time.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free shipping on orders over $150 to USA, Canada, and Australia, and over $120 to the UK and Netherlands. Applicable free shipping thresholds are shown at checkout.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order ships, you\'ll receive a tracking number by email. You can also log into your account dashboard and view real-time tracking under "My Orders".',
      },
      {
        q: 'Will I need to pay customs or import duties?',
        a: 'International orders may be subject to customs duties or import taxes imposed by your country. These fees are the buyer\'s responsibility and are not included in our prices. Please check your local customs regulations. We declare all shipments at full value.',
      },
      {
        q: 'What if my order is delayed or lost?',
        a: 'If your order hasn\'t arrived within the estimated timeframe, please contact us. We\'ll investigate with the carrier and, if confirmed lost, will reship or issue a full refund.',
      },
    ],
  },
  {
    category: 'Products & Authenticity',
    items: [
      {
        q: 'Are your products genuinely from Sri Lanka?',
        a: 'Absolutely. Every product we sell is sourced directly from Sri Lanka — from spice farms in Kandy and Matale, to artisan workshops in Ambalangoda and Galle. We work directly with local producers and craftspeople.',
      },
      {
        q: 'Are your spices organic?',
        a: 'Many of our spices are organically grown, though not all carry formal organic certification. Product descriptions specify when a product is certified organic. All spices are free from artificial additives and preservatives.',
      },
      {
        q: 'How should I store the spices?',
        a: 'Store spices in a cool, dry place away from direct sunlight. Keep them in their original sealed packaging or transfer to airtight containers. Properly stored, our spices maintain peak flavour for 12–24 months.',
      },
      {
        q: 'Are the handicrafts handmade?',
        a: 'Yes. All handicrafts — wooden carvings, coconut shell items, palm leaf baskets, and Ambalangoda masks — are handmade by skilled Sri Lankan artisans. Minor variations in appearance are a natural characteristic of handmade products.',
      },
      {
        q: 'Are the vintage items authentic?',
        a: 'All vintage and heritage items are genuine antiques or historically significant pieces. Each comes with a description of its origin, estimated age, and historical context. We do not sell reproductions as originals.',
      },
    ],
  },
  {
    category: 'Gift Boxes',
    items: [
      {
        q: 'Can I customise a gift box?',
        a: 'Yes! Our gift boxes are fully configurable. You can choose from our pre-made bundles (Spice Box, Tea Lover Box, Heritage Box) or build your own custom selection from our product catalogue.',
      },
      {
        q: 'Can I add a personalised message to a gift?',
        a: 'Yes. During checkout, there is an "Order Notes" field where you can include a personalised gift message. We\'ll hand-write it on a card and include it with your gift box.',
      },
      {
        q: 'Is gift wrapping available?',
        a: 'All gift boxes come beautifully packaged in our signature Lanka Products box with tissue paper. Additional premium gift wrapping is available — select this option on the gift box product page.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your returns policy?',
        a: 'We accept returns within 14 days of delivery for non-perishable items (handicrafts, vintage items) that are unused and in original condition. Food and spice products cannot be returned for hygiene reasons unless they arrived damaged or incorrect.',
      },
      {
        q: 'What if my order arrived damaged?',
        a: 'We\'re sorry to hear that. Please photograph the damage and contact us within 48 hours of delivery. We\'ll arrange a replacement or full refund at no cost to you.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Approved refunds are processed within 3–5 business days to your original payment method. Bank processing times may add an additional 3–7 days.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-charcoal text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-3">Help Centre</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Everything you need to know about ordering, shipping, and our products.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-serif font-bold text-charcoal mb-4 pb-3 border-b border-border">
                {section.category}
              </h2>
              <div className="space-y-1">
                {section.items.map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white rounded-xl border border-border overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none hover:bg-gray-50 transition-colors list-none">
                      <span className="font-medium text-charcoal text-sm">{item.q}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-16 bg-cinnamon/5 border border-cinnamon/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-serif font-bold text-charcoal mb-2">Still have questions?</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Our team is happy to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-cinnamon text-white font-semibold px-6 py-3 rounded-lg hover:bg-cinnamon-dark transition-colors text-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
