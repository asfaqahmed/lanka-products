'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { toast } from '@/components/ui/use-toast'
import { formatPrice, cn } from '@/lib/utils'
import type { Product, ProductImage, Category } from '@/lib/supabase/types'

interface ProductCardProps {
  product: Product & {
    product_images?: ProductImage[]
    categories?: Category | null
    avg_rating?: number
    review_count?: number
  }
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const primaryImage = product.product_images?.find((img) => img.is_primary)
    || product.product_images?.[0]

  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAddingToCart(true)

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: primaryImage?.url || null,
      type: 'product',
      slug: product.slug,
    })

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })

    setTimeout(() => setIsAddingToCart(false), 500)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: isWishlisted
        ? `${product.name} removed from wishlist`
        : `${product.name} saved to wishlist`,
    })
  }

  const rating = product.avg_rating || 4.5
  const reviewCount = product.review_count || 0

  return (
    <Link href={`/products/${product.slug}`} className={cn('block product-card group', className)}>
      {/* Image Container */}
      <div className="relative aspect-square bg-cream overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream to-cinnamon/10">
            <div className="text-center p-4">
              <div className="text-5xl mb-2">🌿</div>
              <p className="text-cinnamon/40 text-xs">No image</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.is_featured && (
            <span className="bg-gold text-charcoal text-xs font-bold px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all',
            isWishlisted
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:bg-white hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100'
          )}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={cn('h-4 w-4', isWishlisted && 'fill-white')} />
        </button>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-cinnamon hover:bg-cinnamon-dark text-white py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-colors disabled:opacity-70"
          >
            <ShoppingCart className="h-4 w-4" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.categories && (
          <span className="badge-category mb-2 inline-block">
            {product.categories.name}
          </span>
        )}

        {/* Name */}
        <h3 className="text-charcoal font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-cinnamon transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < Math.floor(rating)
                    ? 'fill-gold text-gold'
                    : 'fill-gray-200 text-gray-200'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {rating.toFixed(1)}
            {reviewCount > 0 && ` (${reviewCount})`}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="price-tag text-base font-bold">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="compare-price">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
