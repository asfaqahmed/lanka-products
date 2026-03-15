import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react'

const shopLinks = [
  { href: '/shop?category=spices', label: 'Sri Lankan Spices' },
  { href: '/shop?category=handicrafts', label: 'Artisan Handicrafts' },
  { href: '/shop?category=vintage-heritage', label: 'Vintage & Heritage' },
  { href: '/gift-boxes', label: 'Gift Boxes' },
]

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/about#artisans', label: 'Our Artisans' },
  { href: '/about#sustainability', label: 'Sustainability' },
  { href: '/blog', label: 'Blog' },
]

const supportLinks = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/faq', label: 'FAQs' },
  { href: '/shipping', label: 'Shipping Info' },
  { href: '/returns', label: 'Returns Policy' },
  { href: '/dashboard', label: 'Track My Order' },
]

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-full bg-ceylon-gradient flex items-center justify-center">
                <span className="text-white font-bold">LP</span>
              </div>
              <div>
                <span className="text-white font-serif font-bold text-xl block">Lanka Products</span>
                <span className="text-gold text-xs">From the Gardens of Ceylon</span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Bringing the authentic flavors, crafts, and heritage of Sri Lanka to homes around the world.
              Each product tells a story of the island&apos;s rich culture and traditions.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="mailto:hello@lankaproducts.com" className="hover:text-white transition-colors">
                  hello@lankaproducts.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-gold flex-shrink-0" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/lankaproducts"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gold flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/lankaproducts"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gold flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/lankaproducts"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gold flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/@lankaproducts"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gold flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Lanka Products. All rights reserved. |{' '}
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              {' '}|{' '}
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs mr-1">We accept:</span>
              {['VISA', 'MC', 'AMEX', 'PayPal'].map((method) => (
                <div
                  key={method}
                  className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300 font-medium"
                >
                  {method}
                </div>
              ))}
              <div className="bg-gold/20 px-2 py-1 rounded text-xs text-gold font-medium">
                PayHere
              </div>
            </div>
          </div>

          {/* Shipping Countries */}
          <div className="mt-3 text-center">
            <p className="text-gray-600 text-xs">
              Shipping to: 🇺🇸 USA &nbsp;|&nbsp; 🇨🇦 Canada &nbsp;|&nbsp; 🇦🇺 Australia &nbsp;|&nbsp; 🇬🇧 United Kingdom &nbsp;|&nbsp; 🇳🇱 Netherlands
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
