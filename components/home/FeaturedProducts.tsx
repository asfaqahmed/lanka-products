import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import type { ProductWithImages } from '@/lib/supabase/types'

interface FeaturedProductsProps {
  products: ProductWithImages[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-tea font-semibold text-sm uppercase tracking-wider mb-2">
              Handpicked for You
            </p>
            <h2 className="section-heading">Featured Products</h2>
            <p className="section-subheading mt-2">
              Authentic Sri Lankan Craftsmanship
            </p>
          </div>

          <Link href="/shop">
            <Button variant="cinnamon-outline" className="shrink-0">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Category Quick Links */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🌿', label: 'Spices', href: '/shop?category=spices', color: 'bg-tea/10 hover:bg-tea/20 text-tea' },
            { icon: '🎨', label: 'Handicrafts', href: '/shop?category=handicrafts', color: 'bg-cinnamon/10 hover:bg-cinnamon/20 text-cinnamon' },
            { icon: '🏺', label: 'Vintage', href: '/shop?category=vintage-heritage', color: 'bg-gold/10 hover:bg-gold/20 text-gold-dark' },
            { icon: '🎁', label: 'Gift Boxes', href: '/gift-boxes', color: 'bg-charcoal/5 hover:bg-charcoal/10 text-charcoal' },
          ].map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${cat.color}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-semibold text-sm">{cat.label}</span>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
