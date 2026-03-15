import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { GiftBoxesSection } from '@/components/home/GiftBoxesSection'
import { CulturalStorySection } from '@/components/home/CulturalStorySection'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { createServerClient } from '@/lib/supabase/server'
import type { ProductWithImages, GiftBox } from '@/lib/supabase/types'

export const revalidate = 3600 // Revalidate every hour

async function getFeaturedProducts(): Promise<ProductWithImages[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images(*),
        categories(*)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Error fetching featured products:', error)
      return []
    }

    return (data || []) as ProductWithImages[]
  } catch (err) {
    console.error('Failed to fetch featured products:', err)
    return []
  }
}

async function getGiftBoxes(): Promise<GiftBox[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('gift_boxes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching gift boxes:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to fetch gift boxes:', err)
    return []
  }
}

export default async function HomePage() {
  const [featuredProducts, giftBoxes] = await Promise.all([
    getFeaturedProducts(),
    getGiftBoxes(),
  ])

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <CulturalStorySection />
      <GiftBoxesSection giftBoxes={giftBoxes} />
      <NewsletterSection />
    </>
  )
}
