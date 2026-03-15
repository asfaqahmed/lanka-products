import type { Metadata } from 'next'
import { Mail, MapPin, Phone, Clock, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Lanka Products. We\'re here to help with orders, questions, and anything about our authentic Sri Lankan products.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-charcoal text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Have a question about your order or our products? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">How to Reach Us</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cinnamon/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-cinnamon" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">Email</p>
                    <a href="mailto:hello@lankaproducts.com" className="text-cinnamon hover:underline text-sm">
                      hello@lankaproducts.com
                    </a>
                    <p className="text-muted-foreground text-xs mt-0.5">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cinnamon/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-cinnamon" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">WhatsApp</p>
                    <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer" className="text-cinnamon hover:underline text-sm">
                      +94 77 123 4567
                    </a>
                    <p className="text-muted-foreground text-xs mt-0.5">Mon–Fri, 9am–6pm IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cinnamon/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-cinnamon" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">Address</p>
                    <p className="text-muted-foreground text-sm">
                      Lanka Products<br />
                      42 Galle Road<br />
                      Colombo 03, Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cinnamon/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-cinnamon" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">Business Hours</p>
                    <div className="text-muted-foreground text-sm space-y-0.5">
                      <p>Monday – Friday: 9:00am – 6:00pm IST</p>
                      <p>Saturday: 10:00am – 4:00pm IST</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-tea/10 rounded-2xl p-5 border border-tea/20">
              <p className="font-semibold text-charcoal text-sm mb-1">Order Issues?</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                For order tracking or issues, please include your order number (starts with LP-) in your message for faster support.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
              <h2 className="text-xl font-serif font-bold text-charcoal mb-6">Send Us a Message</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-charcoal block mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal block mb-1.5">Last Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-charcoal block mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-charcoal block mb-1.5">Subject *</label>
                  <select className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon bg-white">
                    <option value="">Select a topic</option>
                    <option value="order">Order Inquiry</option>
                    <option value="tracking">Order Tracking</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="product">Product Question</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-charcoal block mb-1.5">Order Number (if applicable)</label>
                  <input
                    type="text"
                    placeholder="LP-20240101-XXXXXX"
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-charcoal block mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cinnamon text-white font-semibold py-3 rounded-lg hover:bg-cinnamon-dark transition-colors text-sm"
                >
                  Send Message
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  We typically respond within 24 business hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
