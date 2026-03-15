import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Lanka Products privacy policy — how we collect, use, and protect your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: March 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm space-y-8 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">1. Who We Are</h2>
            <p>
              Lanka Products (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is an ecommerce business based in Colombo, Sri Lanka, selling authentic Sri Lankan products to international customers. Our website is <strong>lankaproducts.com</strong>. Contact: <a href="mailto:hello@lankaproducts.com" className="text-cinnamon hover:underline">hello@lankaproducts.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Account information:</strong> Name, email address, and password when you create an account.</li>
              <li><strong>Order information:</strong> Shipping address, phone number, and purchase history when you place an order.</li>
              <li><strong>Payment information:</strong> Payments are processed by PayHere. We do not store card details on our servers.</li>
              <li><strong>Usage data:</strong> Pages visited, browser type, IP address, and referring URLs — collected via Google Analytics (with your consent).</li>
              <li><strong>Communications:</strong> Email address and message content when you contact our support team.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">3. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To process and fulfil your orders and send order confirmations.</li>
              <li>To communicate about your order status and tracking.</li>
              <li>To respond to your customer support enquiries.</li>
              <li>To send marketing emails (only if you have opted in — you may unsubscribe at any time).</li>
              <li>To improve our website and product offerings using anonymised analytics data.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">4. Cookies</h2>
            <p className="mb-3">We use the following types of cookies:</p>
            <div className="space-y-3">
              {[
                {
                  name: 'Necessary Cookies',
                  desc: 'Essential for the website to function. These include session cookies, authentication tokens, and your shopping cart data. These cannot be disabled.',
                },
                {
                  name: 'Analytics Cookies',
                  desc: 'We use Google Analytics to understand how visitors interact with our site. This data is anonymised and aggregated. You may opt out via the cookie banner or Google\'s opt-out tool.',
                },
                {
                  name: 'Marketing Cookies',
                  desc: 'Used to track the effectiveness of our advertising campaigns. Only set with your explicit consent.',
                },
              ].map((cookie) => (
                <div key={cookie.name} className="bg-cream rounded-lg p-4">
                  <p className="font-semibold text-charcoal text-sm mb-1">{cookie.name}</p>
                  <p className="text-xs">{cookie.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs">
              You can manage your cookie preferences at any time via the cookie banner at the bottom of the page, or by clearing cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">5. Data Sharing</h2>
            <p className="mb-3">We do not sell your personal data. We share your information only with:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>PayHere:</strong> To process your payments securely.</li>
              <li><strong>Shipping carriers:</strong> Your name and address are shared with our courier partners to deliver your order.</li>
              <li><strong>Hostinger (email):</strong> Our email service provider to send transactional and marketing emails.</li>
              <li><strong>Google Analytics:</strong> Anonymised usage data for site analytics (with your consent).</li>
              <li><strong>Supabase:</strong> Our database and authentication provider, hosting your account and order data.</li>
            </ul>
            <p className="mt-3">All third-party processors are contractually bound to handle your data securely and in compliance with applicable privacy laws.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">6. Data Retention</h2>
            <p>We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Order records are kept for 7 years for accounting purposes. You may request deletion of your account data at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">7. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the following rights:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
              <li><strong>Deletion:</strong> Request deletion of your data (&quot;right to be forgotten&quot;).</li>
              <li><strong>Portability:</strong> Receive your data in a portable format.</li>
              <li><strong>Objection:</strong> Object to our processing of your data for marketing purposes.</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent for analytics or marketing cookies at any time.</li>
            </ul>
            <p className="mt-3">To exercise these rights, email us at <a href="mailto:hello@lankaproducts.com" className="text-cinnamon hover:underline">hello@lankaproducts.com</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">8. Security</h2>
            <p>We implement industry-standard security measures including HTTPS encryption, secure authentication via Supabase Auth, and encrypted database storage. Payment data is handled entirely by PayHere&apos;s PCI-compliant infrastructure.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">9. International Transfers</h2>
            <p>Your data may be transferred to and processed in countries outside your own (including Sri Lanka, the United States, and the European Union) by our service providers. All such transfers are covered by appropriate data protection safeguards.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">10. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of significant changes by email or by posting a notice on our website. The &quot;Last updated&quot; date at the top indicates when the policy was last revised.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-3">11. Contact</h2>
            <p>
              If you have any questions about this privacy policy or how we handle your data, please contact us at{' '}
              <a href="mailto:hello@lankaproducts.com" className="text-cinnamon hover:underline">hello@lankaproducts.com</a>{' '}
              or visit our <Link href="/contact" className="text-cinnamon hover:underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
