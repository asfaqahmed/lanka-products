'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/products/ProductCard'
import { cn } from '@/lib/utils'
import type { Category, ProductWithImages } from '@/lib/supabase/types'

interface ShopClientProps {
  initialProducts: ProductWithImages[]
  categories: Category[]
  total: number
  searchParams: {
    category?: string
    search?: string
    sort?: string
    page?: string
    minPrice?: string
    maxPrice?: string
  }
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

const PER_PAGE = 12

export function ShopClient({
  initialProducts,
  categories,
  total,
  searchParams,
}: ShopClientProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.search || '')
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || '')

  const currentPage = Number(searchParams.page) || 1
  const totalPages = Math.ceil(total / PER_PAGE)

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams()

      // Preserve existing params
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      // Reset to page 1 when filters change
      if (!updates.page) {
        params.delete('page')
      }

      router.push(`/shop?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ search: searchInput || undefined })
  }

  const handleCategoryFilter = (slug: string | null) => {
    updateParams({ category: slug || undefined })
    setIsSidebarOpen(false)
  }

  const handlePriceFilter = () => {
    updateParams({
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    })
  }

  const handleSort = (value: string) => {
    updateParams({ sort: value })
  }

  const handlePage = (page: number) => {
    updateParams({ page: page.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearchInput('')
    setMinPrice('')
    setMaxPrice('')
    router.push('/shop')
  }

  const hasActiveFilters =
    searchParams.category ||
    searchParams.search ||
    searchParams.minPrice ||
    searchParams.maxPrice

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-transform md:relative md:inset-auto md:w-64 md:transform-none md:shadow-none md:block',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          )}
        >
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between p-4 border-b md:hidden">
            <h2 className="font-semibold text-charcoal">Filters</h2>
            <button onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 md:p-0 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-3">
                Categories
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategoryFilter(null)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      !searchParams.category
                        ? 'bg-cinnamon/10 text-cinnamon font-medium'
                        : 'text-charcoal hover:bg-gray-100'
                    )}
                  >
                    All Products
                    <span className="ml-auto float-right text-muted-foreground text-xs">
                      {total}
                    </span>
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryFilter(cat.slug)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        searchParams.category === cat.slug
                          ? 'bg-cinnamon/10 text-cinnamon font-medium'
                          : 'text-charcoal hover:bg-gray-100'
                      )}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-3">
                Price Range (USD)
              </h3>
              <div className="flex gap-2 items-center mb-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cinnamon"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cinnamon"
                />
              </div>
              <Button
                size="sm"
                variant="cinnamon-outline"
                className="w-full"
                onClick={handlePriceFilter}
              >
                Apply Price Filter
              </Button>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Clear All Filters
              </Button>
            )}
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
              />
            </form>

            <div className="flex gap-2">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                Filters
              </Button>

              {/* Sort Dropdown */}
              <select
                value={searchParams.sort || 'newest'}
                onChange={(e) => handleSort(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cinnamon/30 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results info */}
          <p className="text-sm text-muted-foreground mb-4">
            Showing {initialProducts.length} of {total} products
            {searchParams.search && (
              <span> for &quot;{searchParams.search}&quot;</span>
            )}
          </p>

          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchParams.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-cinnamon/10 text-cinnamon rounded-full text-xs font-medium">
                  {categories.find((c) => c.slug === searchParams.category)?.name || searchParams.category}
                  <button onClick={() => updateParams({ category: undefined })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchParams.search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-cinnamon/10 text-cinnamon rounded-full text-xs font-medium">
                  Search: {searchParams.search}
                  <button onClick={() => { setSearchInput(''); updateParams({ search: undefined }) }}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(searchParams.minPrice || searchParams.maxPrice) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-cinnamon/10 text-cinnamon rounded-full text-xs font-medium">
                  Price: ${searchParams.minPrice || '0'} - ${searchParams.maxPrice || '∞'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); updateParams({ minPrice: undefined, maxPrice: undefined }) }}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {initialProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {initialProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePage(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'cinnamon' : 'outline'}
                        size="sm"
                        onClick={() => handlePage(page)}
                        className="w-9"
                      >
                        {page}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <Button variant="cinnamon" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
