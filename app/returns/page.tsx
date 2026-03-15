import type { Metadata } from 'next'
import Link from 'next/link'
import { RefreshCw, CheckCircle, XCircle, Clock, Mail, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Returns & Refund Policy',
  description: 'Learn about Lanka Products\' returns and refund policy. We want you to be completely satisfied with every purchase.',
}

const eligible = [
  'Handicrafts and wooden carvings (unused, in original condition)',
  'Coconut shell products (unused, in original condition)',
  'Vintage and heritage items (in original condition)',
  'Palm leaf baskets (unused, in original packaging)',
  'Items that arrived damaged or defective',
  'Incorrect items sent by our error',
]

const notEligible = [
  'Spices and food products (for hygiene and food safety reasons)',
  'Opened or used products of any kind',
  'Items returned after 14 days of delivery',
  'Items without original packaging',
  'Custom or personalised gift box orders',
  'Digital products or downloadable content',
]

const steps = [
  {
    num: '1',
    title: 'Contact Us Within 14 Days',
    desc: 'Email hello@lankaproducts.com with your order number and reason for return. For damaged items, attach clear photos.',
  },
  {
    num: '2',
    title: 'Receive Return Approval',
    desc: 'Our team will review your request and respond within 1–2 business days with return instructions and a return authorisation number.',
  },
  {
    num: '3',
    title: 'Ship the Item Back',
    desc: 'Pack the item securely and ship it to our Colombo address. You are responsible for return shipping costs unless the item is defective or incorrect.',
  },
  {
    num: '4',
    title: 'Inspection & Refund',
    desc: 'Once we receive and inspect the item (1–3 business days), we\'ll process your refund to the original payment method within 3–5 business days.',
  },
]

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-charcoal text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-3">Our Promise</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Returns & Refund Policy</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Your satisfaction is our priority. If something isn&apos;t right, we&apos;ll make it right.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">

        {/* Overview */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-tea/10 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-6 w-6 text-tea" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-charcoal mb-1">14-Day Return Window</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We accept returns within <strong>14 days of delivery</strong> for eligible items in their original, unused condition. Please read the full policy below before initiating a return.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Eligible / Not Eligible */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">What Can Be Returned?</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-green-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-charcoal text-sm">Eligible for Return</h3>
              </div>
              <ul className="space-y-2">
                {eligible.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-red-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-charcoal text-sm">Not Eligible for Return</h3>
              </div>
              <ul className="space-y-2">
                {notEligible.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Damaged / Wrong Items */}
        <section className="mb-12">
          <div className="bg-cinnamon/5 border border-cinnamon/20 rounded-2xl p-6">
            <h2 className="text-lg font-serif font-bold text-charcoal mb-2">Damaged, Defective, or Wrong Items</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              If your order arrived damaged, defective, or you received the wrong item, we sincerely apologise. In these cases:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-cinnamon font-bold mt-0.5">→</span>
                Contact us within <strong>48 hours of delivery</strong> with photos of the damage or incorrect item.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cinnamon font-bold mt-0.5">→</span>
                We will cover all return shipping costs.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cinnamon font-bold mt-0.5">→</span>
                We will reship the correct/replacement item or issue a full refund — your choice.
              </li>
            </ul>
          </div>
        </section>

        {/* Return Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">How to Return an Item</h2>
          <p className="text-muted-foreground text-sm mb-8">Follow these steps to initiate a return.</p>

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.num} className="flex items-start gap-5">
                <div className="w-9 h-9 rounded-full bg-cinnamon text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {step.num}
                </div>
                <div className="bg-white rounded-xl border border-border p-4 flex-1">
                  <p className="font-semibold text-charcoal text-sm">{step.title}</p>
                  <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Refund Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">Refund Timeline</h2>
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            {[
              { icon: Mail, label: 'Return request received', time: 'Same day' },
              { icon: RefreshCw, label: 'Return approved & instructions sent', time: '1–2 business days' },
              { icon: Package, label: 'Item received & inspected by us', time: '1–3 days after receipt' },
              { icon: Clock, label: 'Refund processed to your account', time: '3–5 business days after inspection' },
              { icon: CheckCircle, label: 'Refund visible in your account', time: 'Additional 3–7 days (bank dependent)' },
            ].map((row, idx) => (
              <div key={idx} className={`flex items-center gap-4 px-5 py-4 ${idx !== 4 ? 'border-b border-border' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center flex-shrink-0">
                  <row.icon className="h-4 w-4 text-cinnamon" />
                </div>
                <span className="text-sm text-charcoal flex-1">{row.label}</span>
                <span className="text-xs text-muted-foreground font-medium bg-cream px-2.5 py-1 rounded-full whitespace-nowrap">{row.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Return Address */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Return Address</h2>
          <div className="bg-white rounded-xl border border-border p-5 text-sm">
            <p className="font-semibold text-charcoal mb-2">Lanka Products Returns</p>
            <p className="text-muted-foreground">
              42 Galle Road<br />
              Colombo 03<br />
              Sri Lanka<br />
              <br />
              <strong>Attention:</strong> Returns Department<br />
              <strong>Reference:</strong> [Your Order Number]
            </p>
            <p className="mt-3 text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg p-3">
              Always include your order number inside the package and on the outer label. Items received without a return authorisation number may not be processed.
            </p>
          </div>
        </section>

        {/* Contact */}
        <div className="bg-charcoal rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-serif font-bold mb-2">Need to Start a Return?</h2>
          <p className="text-gray-400 text-sm mb-6">
            Contact our team with your order number and we&apos;ll guide you through the process.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold text-charcoal font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors text-sm"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
