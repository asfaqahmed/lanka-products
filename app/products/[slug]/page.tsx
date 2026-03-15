import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Package, Truck, ShieldCheck, ArrowLeft } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
import { ProductCard } from '@/components/products/ProductCard'
import { ReviewSection } from '@/components/products/ReviewSection'
import { AddToCartSection } from '@/components/products/AddToCartSection'
import { formatPrice } from '@/lib/utils'
import type { ProductWithDetails, ProductWithImages } from '@/lib/supabase/types'

interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string): Promise<ProductWithDetails | null> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images(*),
        categories(*),
        reviews(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) return null
    return data as ProductWithDetails
  } catch {
    return null
  }
}

async function getRelatedProducts(
  categoryId: string | null,
  currentId: string
): Promise<ProductWithImages[]> {
  try {
    const supabase = createServerClient()
    let query = supabase
      .from('products')
      .select('*, product_images(*), categories(*)')
      .eq('is_active', true)
      .neq('id', currentId)
      .limit(4)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data } = await query
    return (data || []) as ProductWithImages[]
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  const primaryImage = product.product_images?.find((i) => i.is_primary) || product.product_images?.[0]

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description || product.description || '',
    openGraph: {
      title: product.name,
      description: product.short_description || product.description || '',
      images: primaryImage ? [{ url: primaryImage.url, alt: primaryImage.alt_text || product.name }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(
    product.category_id,
    product.id
  )

  const primaryImage = product.product_images?.find((i) => i.is_primary) || product.product_images?.[0]
  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) || []

  const approvedReviews = product.reviews?.filter((r) => r.is_approved) || []
  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
    : 0

  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images.map((img) => img.url),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Lanka Products',
      },
    },
    aggregateRating: avgRating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: approvedReviews.length,
    } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-cinnamon transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-cinnamon transition-colors">Shop</Link>
            {product.categories && (
              <>
                <span>/</span>
                <Link
                  href={`/shop?category=${product.categories.slug}`}
                  className="hover:text-cinnamon transition-colors"
                >
                  {product.categories.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-charcoal">{product.name}</span>
          </div>

          {/* Product Layout */}
          <div className="grid lg:grid-cols-2 gap-10 mb-16">
            {/* Images */}
            <div className="space-y-3">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-border">
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.alt_text || product.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream to-cinnamon/10">
                    <div className="text-8xl">🌿</div>
                  </div>
                )}
                {discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-square rounded-lg overflow-hidden bg-white border border-border cursor-pointer hover:border-cinnamon transition-colors"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt_text || product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category */}
              {product.categories && (
                <Link
                  href={`/shop?category=${product.categories.slug}`}
                  className="badge-category mb-3 inline-block"
                >
                  {product.categories.name}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {avgRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(avgRating) ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-charcoal">{avgRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({approvedReviews.length} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-cinnamon">
                  {formatPrice(product.price)}
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.short_description && (
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.short_description}
                </p>
              )}

              {/* Add to Cart */}
              <AddToCartSection product={product} primaryImage={primaryImage?.url || null} />

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: Package, label: 'Authentic', sub: 'Certified Sri Lankan' },
                  { icon: Truck, label: 'Free Shipping', sub: 'Orders over $150' },
                  { icon: ShieldCheck, label: 'Secure', sub: '100% safe checkout' },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-border"
                  >
                    <badge.icon className="h-5 w-5 text-cinnamon mb-1" />
                    <span className="text-xs font-semibold text-charcoal">{badge.label}</span>
                    <span className="text-xs text-muted-foreground">{badge.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description & Origin Story */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {product.description && (
              <div className="bg-white rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-serif font-bold text-charcoal mb-4">Product Description</h2>
                <div className="prose prose-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            )}

            {product.origin_story && (
              <div className="bg-gradient-to-br from-cinnamon/5 to-tea/5 rounded-2xl p-6 border border-cinnamon/10">
                <h2 className="text-xl font-serif font-bold text-cinnamon mb-4">The Origin Story</h2>
                <div className="text-charcoal/80 leading-relaxed whitespace-pre-wrap text-sm">
                  {product.origin_story}
                </div>
              </div>
            )}
          </div>

          {/* Reviews */}
          <ReviewSection productId={product.id} reviews={approvedReviews} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="section-heading mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((related) => (
                  <ProductCard key={related.id} product={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
