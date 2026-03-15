import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Gift, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { GiftBox } from '@/lib/supabase/types'

interface GiftBoxesSectionProps {
  giftBoxes: GiftBox[]
}

export function GiftBoxesSection({ giftBoxes }: GiftBoxesSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-charcoal relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-cinnamon/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-2">
              Perfect Gifts
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Curated Gift Boxes
            </h2>
            <p className="text-gray-400 mt-2 text-lg">
              Share the Taste of Sri Lanka with Loved Ones
            </p>
          </div>

          <Link href="/gift-boxes">
            <Button variant="gold-outline" className="shrink-0">
              See All Gift Boxes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Gift Boxes Grid */}
        {giftBoxes && giftBoxes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftBoxes.slice(0, 3).map((box) => (
              <Link
                key={box.id}
                href={`/gift-boxes/${box.slug}`}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-2xl overflow-hidden transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-cinnamon/20 to-tea/20 overflow-hidden">
                  {box.image_url ? (
                    <Image
                      src={box.image_url}
                      alt={box.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Gift className="h-16 w-16 text-gold mx-auto mb-3" />
                        <p className="text-white/40 text-sm">Gift Box</p>
                      </div>
                    </div>
                  )}

                  {box.is_customizable && (
                    <div className="absolute top-3 left-3 bg-tea text-white text-xs font-bold px-2 py-1 rounded-full">
                      Customizable
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                    ))}
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold transition-colors">
                    {box.name}
                  </h3>

                  {box.description && (
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                      {box.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold text-xl">
                      {formatPrice(box.price)}
                    </span>
                    <span className="text-white/60 text-sm group-hover:text-white transition-colors flex items-center gap-1">
                      View Box
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Placeholder if no gift boxes yet */
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ceylon Spice Discovery',
                price: 89.99,
                icon: '🌿',
                items: ['True Ceylon Cinnamon', 'Black Pepper', 'Cardamom', 'Cloves'],
              },
              {
                name: 'Artisan Craft Collection',
                price: 129.99,
                icon: '🎨',
                items: ['Hand-painted Mask', 'Batik Sarong', 'Lacquerware Bowl'],
              },
              {
                name: 'The Grand Ceylon Box',
                price: 199.99,
                icon: '🏆',
                items: ['6 Premium Spices', '2 Handicrafts', 'Ceylon Tea Selection'],
                featured: true,
              },
            ].map((box) => (
              <Link
                key={box.name}
                href="/gift-boxes"
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-cinnamon/20 to-tea/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-3">{box.icon}</div>
                    {'featured' in box && box.featured && (
                      <span className="bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded-full">
                        Best Seller
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                    ))}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold transition-colors">
                    {box.name}
                  </h3>
                  <ul className="text-gray-400 text-xs space-y-1 mb-4">
                    {box.items.map((item) => (
                      <li key={item} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-gold inline-block" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold text-xl">
                      {formatPrice(box.price)}
                    </span>
                    <span className="text-white/60 text-sm group-hover:text-white transition-colors flex items-center gap-1">
                      View Box
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Want a custom gift? We create personalized boxes for corporate and special occasions.
          </p>
          <Link href="/contact?type=custom-gift">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Request Custom Gift Box
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
