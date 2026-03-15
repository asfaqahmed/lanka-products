import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Gift, Star, ArrowRight, Check } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { GiftBoxWithItems } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Sri Lankan Gift Boxes - Curated Authentic Gifts',
  description:
    'Discover beautifully curated Sri Lankan gift boxes — perfect for birthdays, holidays, and corporate gifting. Authentic products, worldwide shipping.',
}

async function getGiftBoxes(): Promise<GiftBoxWithItems[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('gift_boxes')
      .select(`
        *,
        gift_box_items(*, products(*))
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    return (data || []) as GiftBoxWithItems[]
  } catch {
    return []
  }
}

const placeholderBoxes = [
  {
    id: '1',
    name: 'Ceylon Spice Discovery',
    slug: 'ceylon-spice-discovery',
    description: 'Embark on a flavorful journey with our handpicked selection of premium Ceylon spices.',
    price: 89.99,
    is_customizable: false,
    items: ['True Ceylon Cinnamon (100g)', 'Black Pepper (50g)', 'Green Cardamom (50g)', 'Cloves (30g)', 'Turmeric Powder (100g)'],
    emoji: '🌿',
    badge: null,
  },
  {
    id: '2',
    name: 'Artisan Craft Collection',
    slug: 'artisan-craft-collection',
    description: 'A curated selection of handcrafted items representing Sri Lanka\'s rich artisan tradition.',
    price: 129.99,
    is_customizable: true,
    items: ['Hand-painted Kandyan Mask', 'Batik Silk Sarong', 'Lacquerware Decorative Bowl', 'Handwoven Basket'],
    emoji: '🎨',
    badge: 'Most Popular',
  },
  {
    id: '3',
    name: 'The Grand Ceylon Box',
    slug: 'grand-ceylon-box',
    description: 'The ultimate Sri Lankan experience — our most comprehensive gift box with premium selections.',
    price: 199.99,
    is_customizable: true,
    items: ['6 Premium Spices', '2 Handcrafted Items', 'Ceylon Tea Selection (3 varieties)', 'Heritage Cookbook', 'Gift Card'],
    emoji: '🏆',
    badge: 'Best Value',
  },
]

export default async function GiftBoxesPage() {
  const giftBoxes = await getGiftBoxes()
  const displayBoxes = giftBoxes.length > 0 ? giftBoxes : null

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cinnamon/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative text-center">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-2 mb-6">
            <Gift className="h-4 w-4 text-gold" />
            <span className="text-gold text-sm font-medium">Thoughtfully Curated</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Sri Lankan Gift Boxes
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8">
            Share the magic of Ceylon with your loved ones. Each box is a journey through the island&apos;s
            finest flavors, crafts, and heritage.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-tea" /> Gift wrapping included</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-tea" /> Personalized message card</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-tea" /> Worldwide shipping</span>
          </div>
        </div>
      </section>

      {/* Gift Boxes Grid */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          {displayBoxes ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {giftBoxes.map((box) => (
                <div key={box.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-cinnamon/10 to-tea/10 overflow-hidden">
                    {box.image_url ? (
                      <Image src={box.image_url} alt={box.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gift className="h-20 w-20 text-cinnamon/30" />
                      </div>
                    )}
                    {box.is_customizable && (
                      <div className="absolute top-3 right-3 bg-tea text-white text-xs font-bold px-2 py-1 rounded-full">
                        Customizable
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <h2 className="text-xl font-serif font-bold text-charcoal mb-2 group-hover:text-cinnamon transition-colors">
                      {box.name}
                    </h2>
                    {box.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{box.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-cinnamon">{formatPrice(box.price)}</span>
                      <Link href={`/gift-boxes/${box.slug}`}>
                        <Button variant="cinnamon" size="sm">
                          View Box <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {placeholderBoxes.map((box) => (
                <div key={box.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-cinnamon/10 to-tea/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-7xl mb-2">{box.emoji}</div>
                      {box.badge && (
                        <span className="bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded-full">
                          {box.badge}
                        </span>
                      )}
                    </div>
                    {box.is_customizable && (
                      <div className="absolute top-3 right-3 bg-tea text-white text-xs font-bold px-2 py-1 rounded-full">
                        Customizable
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <h2 className="text-xl font-serif font-bold text-charcoal mb-2">{box.name}</h2>
                    <p className="text-muted-foreground text-sm mb-4">{box.description}</p>
                    <ul className="space-y-1.5 mb-5">
                      {box.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
                          <Check className="h-4 w-4 text-tea flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-2xl font-bold text-cinnamon">{formatPrice(box.price)}</span>
                      <Button variant="cinnamon" size="sm">
                        Add to Cart <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom Gift Box CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-cinnamon to-tea rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Need a Custom Gift Box?
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
              Corporate gifts, wedding favors, or special occasions — we create bespoke
              Sri Lankan gift boxes tailored to your needs.
            </p>
            <Link href="/contact?type=custom-gift">
              <Button size="lg" className="bg-white text-cinnamon hover:bg-cream font-bold">
                Request Custom Box
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
