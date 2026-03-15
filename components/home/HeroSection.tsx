import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-ceylon opacity-90" />

      {/* Decorative Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-tea/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cinnamon/20 blur-3xl" />
      </div>

      {/* Batik Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-gold"
            style={{
              width: `${60 + (i % 5) * 40}px`,
              height: `${60 + (i % 5) * 40}px`,
              left: `${(i * 137.5) % 100}%`,
              top: `${(i * 89.3) % 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-gold fill-gold" />
              <span className="text-gold text-sm font-medium">Authentic Sri Lankan Products</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6">
              Discover the{' '}
              <span className="text-gold">Flavors & Crafts</span>{' '}
              of Ceylon
            </h1>

            <p className="text-white/85 text-xl leading-relaxed mb-8 max-w-lg">
              Authentic Sri Lankan products delivered worldwide. From aromatic Ceylon spices to
              exquisite handcrafted treasures — experience the island's rich heritage.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-white/70">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>Free shipping over $150</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>Ships to USA, CA, AU, UK, NL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>100% Authentic Sourcing</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-charcoal font-bold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/gift-boxes">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-cinnamon font-semibold px-8 py-3 text-base"
                >
                  Explore Gift Boxes
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-serif font-bold text-gold">500+</div>
                <div className="text-white/60 text-sm mt-0.5">Products</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-gold">5</div>
                <div className="text-white/60 text-sm mt-0.5">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-gold">2000+</div>
                <div className="text-white/60 text-sm mt-0.5">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main product display */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-8xl mb-4">🌿</div>
                    <p className="text-white/60 text-sm">Ceylon Spices Collection</p>
                  </div>
                </div>
              </div>

              {/* Floating product cards */}
              <div className="absolute -left-12 top-1/4 bg-white rounded-2xl shadow-2xl p-4 w-40">
                <div className="text-3xl mb-2">🫚</div>
                <p className="text-charcoal font-semibold text-sm">Ceylon Cinnamon</p>
                <p className="text-cinnamon font-bold text-sm mt-1">$24.99</p>
              </div>

              <div className="absolute -right-12 bottom-1/4 bg-white rounded-2xl shadow-2xl p-4 w-40">
                <div className="text-3xl mb-2">🎁</div>
                <p className="text-charcoal font-semibold text-sm">Ceylon Gift Box</p>
                <p className="text-cinnamon font-bold text-sm mt-1">$89.99</p>
              </div>

              {/* Rating badge */}
              <div className="absolute -top-6 right-8 bg-gold rounded-2xl shadow-xl px-4 py-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-charcoal text-charcoal" />
                  ))}
                </div>
                <p className="text-charcoal text-xs font-bold mt-0.5">4.9/5 Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="#FFF8F0"/>
        </svg>
      </div>
    </section>
  )
}
