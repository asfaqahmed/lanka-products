import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
import { ShopClient } from '@/components/shop/ShopClient'
import type { Category, ProductWithImages } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Shop Authentic Sri Lankan Products',
  description:
    'Browse our collection of authentic Sri Lankan products — spices, handicrafts, vintage items, and gift boxes. Shipped worldwide.',
}

export const revalidate = 1800

interface ShopPageProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    page?: string
    minPrice?: string
    maxPrice?: string
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    return data || []
  } catch {
    return []
  }
}

async function getProducts(params: ShopPageProps['searchParams']): Promise<{
  products: ProductWithImages[]
  total: number
}> {
  try {
    const supabase = createServerClient()
    const page = Number(params.page) || 1
    const perPage = 12
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('products')
      .select(`
        *,
        product_images(*),
        categories(*)
      `, { count: 'exact' })
      .eq('is_active', true)
      .range(from, to)

    // Category filter
    if (params.category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', params.category)
        .single()
      if (cat) {
        query = query.eq('category_id', cat.id)
      }
    }

    // Search filter
    if (params.search) {
      query = query.ilike('name', `%${params.search}%`)
    }

    // Price range
    if (params.minPrice) {
      query = query.gte('price', Number(params.minPrice))
    }
    if (params.maxPrice) {
      query = query.lte('price', Number(params.maxPrice))
    }

    // Sort
    switch (params.sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'featured':
        query = query.order('is_featured', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data, count, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return { products: [], total: 0 }
    }

    return {
      products: (data || []) as ProductWithImages[],
      total: count || 0,
    }
  } catch {
    return { products: [], total: 0 }
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getProducts(searchParams),
  ])

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">Shop</h1>
          <p className="text-muted-foreground mt-1">
            Authentic Sri Lankan products delivered to your door
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-cinnamon">Shop</span>
            {searchParams.category && (
              <>
                <span>/</span>
                <span className="text-cinnamon capitalize">
                  {searchParams.category.replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <ShopClient
        initialProducts={products}
        categories={categories}
        total={total}
        searchParams={searchParams}
      />
    </div>
  )
}
