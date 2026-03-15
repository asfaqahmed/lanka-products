import type { Metadata } from 'next'
import Link from 'next/link'
import { Truck, Clock, Package, ShieldCheck, AlertCircle, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Information',
  description: 'Shipping rates, delivery times, and customs information for Lanka Products international orders to USA, Canada, Australia, UK, and Netherlands.',
}

const shippingRates = [
  {
    flag: '🇺🇸',
    country: 'United States',
    rate: '$18.00',
    time: '7–14 business days',
    freeThreshold: '$150',
  },
  {
    flag: '🇨🇦',
    country: 'Canada',
    rate: '$20.00',
    time: '7–14 business days',
    freeThreshold: '$150',
  },
  {
    flag: '🇦🇺',
    country: 'Australia',
    rate: '$22.00',
    time: '10–18 business days',
    freeThreshold: '$200',
  },
  {
    flag: '🇬🇧',
    country: 'United Kingdom',
    rate: '$15.00',
    time: '5–10 business days',
    freeThreshold: '$120',
  },
  {
    flag: '🇳🇱',
    country: 'Netherlands',
    rate: '$15.00',
    time: '5–10 business days',
    freeThreshold: '$120',
  },
]

const process = [
  {
    step: '1',
    title: 'Order Placed',
    desc: 'You receive an order confirmation email with your order number.',
  },
  {
    step: '2',
    title: 'Order Processed',
    desc: 'We carefully pack your items within 1–2 business days.',
  },
  {
    step: '3',
    title: 'Dispatched from Sri Lanka',
    desc: 'Your parcel is handed to our international shipping carrier with a tracking number.',
  },
  {
    step: '4',
    title: 'In Transit',
    desc: 'Your parcel travels from Colombo to your country. You can track it online.',
  },
  {
    step: '5',
    title: 'Customs Clearance',
    desc: 'Your parcel passes through your country\'s customs. This usually takes 1–3 days.',
  },
  {
    step: '6',
    title: 'Delivered',
    desc: 'Your authentic Sri Lankan products arrive at your door!',
  },
]

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-charcoal text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-3">Worldwide Delivery</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Shipping Information</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            We ship from Colombo, Sri Lanka to your door. Every order is packed with care and tracked throughout its journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">

        {/* Rates Table */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">Shipping Rates & Delivery Times</h2>
          <p className="text-muted-foreground text-sm mb-6">All prices in USD. Free shipping thresholds are applied automatically at checkout.</p>

          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-charcoal text-white">
                  <th className="text-left px-5 py-3.5 font-semibold">Country</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Shipping Cost</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Estimated Delivery</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Free Shipping From</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shippingRates.map((r) => (
                  <tr key={r.country} className="hover:bg-cream/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-charcoal">
                      <span className="mr-2 text-base">{r.flag}</span>{r.country}
                    </td>
                    <td className="px-5 py-4 text-charcoal">{r.rate}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-tea" />
                        {r.time}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-tea/10 text-tea text-xs font-semibold px-2.5 py-1 rounded-full">
                        Free over {r.freeThreshold}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            Delivery times are estimates and may vary due to customs clearance or carrier delays. Business days exclude weekends and public holidays.
          </p>
        </section>

        {/* Shipping Process */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">How Your Order Gets to You</h2>
          <p className="text-muted-foreground text-sm mb-8">From our hands in Sri Lanka to your door worldwide.</p>

          <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-px bg-border hidden md:block" />
            <div className="space-y-6">
              {process.map((step) => (
                <div key={step.step} className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-cinnamon text-white font-bold text-sm flex items-center justify-center flex-shrink-0 relative z-10">
                    {step.step}
                  </div>
                  <div className="bg-white rounded-xl border border-border p-4 flex-1">
                    <p className="font-semibold text-charcoal text-sm">{step.title}</p>
                    <p className="text-muted-foreground text-sm mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customs */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">Customs & Import Duties</h2>
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-cinnamon mt-0.5 flex-shrink-0" />
              <p>
                <span className="text-charcoal font-medium">International customs fees:</span> Orders shipped outside Sri Lanka may be subject to import duties, taxes, or customs fees imposed by your country&apos;s government. These charges are entirely the buyer&apos;s responsibility and are not included in our product or shipping prices.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-cinnamon mt-0.5 flex-shrink-0" />
              <p>
                <span className="text-charcoal font-medium">Declared value:</span> We declare all shipments at their full purchase value as required by law. We do not under-declare shipment values.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-cinnamon mt-0.5 flex-shrink-0" />
              <p>
                <span className="text-charcoal font-medium">Food & agricultural products:</span> Our spices and food products comply with international export regulations. All products are properly labelled with ingredients and country of origin (Sri Lanka).
              </p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs">
                We recommend checking your country&apos;s customs authority website for up-to-date import thresholds and duty rates. Common resources: <strong>USA</strong> — CBP.gov, <strong>Canada</strong> — CBSA-ASFC.gc.ca, <strong>Australia</strong> — ABF.gov.au, <strong>UK</strong> — GOV.UK/customs-duty, <strong>Netherlands</strong> — Douane.nl
              </p>
            </div>
          </div>
        </section>

        {/* Packaging */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">Our Packaging</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Package,
                title: 'Carefully Packed',
                desc: 'Every item is individually wrapped and cushioned to survive international transit.',
              },
              {
                icon: ShieldCheck,
                title: 'Spill-Proof',
                desc: 'Spices are heat-sealed in double-layered packaging to prevent leaks and preserve freshness.',
              },
              {
                icon: Truck,
                title: 'Eco-Friendly',
                desc: 'We use recycled cardboard boxes and biodegradable packing materials wherever possible.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-border p-5 text-center">
                <div className="w-12 h-12 rounded-xl bg-cinnamon/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-cinnamon" />
                </div>
                <p className="font-semibold text-charcoal text-sm mb-1">{item.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-charcoal rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-serif font-bold mb-2">Questions About Your Shipment?</h2>
          <p className="text-gray-400 text-sm mb-6">
            Our support team is here to help. Include your order number for faster assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-gold text-charcoal font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors text-sm"
            >
              Contact Support
            </Link>
            <Link
              href="/dashboard"
              className="bg-white/10 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Track My Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
