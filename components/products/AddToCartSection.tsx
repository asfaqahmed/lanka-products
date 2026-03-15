'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { toast } from '@/components/ui/use-toast'
import type { Product } from '@/lib/supabase/types'

interface AddToCartSectionProps {
  product: Product
  primaryImage: string | null
}

export function AddToCartSection({ product, primaryImage }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: primaryImage,
      type: 'product',
      slug: product.slug,
    })

    toast({
      title: 'Added to cart!',
      description: `${quantity}x ${product.name} added to your cart.`,
    })
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-charcoal">Quantity:</span>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 font-medium text-charcoal min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          variant="cinnamon"
          size="lg"
          className="flex-1 text-base font-semibold"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>

        <Button
          onClick={() => {
            setIsWishlisted(!isWishlisted)
            toast({
              title: isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist',
            })
          }}
          variant="outline"
          size="lg"
          className={isWishlisted ? 'border-red-300 text-red-500 hover:bg-red-50' : ''}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      {/* SKU & Weight */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
        {product.sku && <p>SKU: <span className="font-medium">{product.sku}</span></p>}
        {product.weight_grams && <p>Weight: <span className="font-medium">{product.weight_grams}g</span></p>}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
