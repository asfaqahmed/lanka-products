'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/admin/ProductForm'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { Category, ProductWithImages } from '@/lib/supabase/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithImages[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithImages | null>(null)
  const supabase = createClient()

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, product_images(*), categories(*), inventory(*)')
      .order('created_at', { ascending: false })

    setProducts((data || []) as ProductWithImages[])
    setIsLoading(false)
  }

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').eq('is_active', true)
    setCategories(data || [])
  }

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const handleToggleActive = async (product: ProductWithImages) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)

    if (!error) {
      setProducts(products.map((p) =>
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      ))
      toast({
        title: `Product ${!product.is_active ? 'activated' : 'deactivated'}`,
      })
    }
  }

  const handleDelete = async (product: ProductWithImages) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return
    }

    const { error } = await supabase.from('products').delete().eq('id', product.id)

    if (!error) {
      setProducts(products.filter((p) => p.id !== product.id))
      toast({ title: 'Product deleted' })
    } else {
      toast({ title: 'Error deleting product', variant: 'destructive' })
    }
  }

  const handleSave = () => {
    setShowForm(false)
    setEditingProduct(null)
    loadProducts()
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  if (showForm || editingProduct) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => { setShowForm(false); setEditingProduct(null) }}
          >
            ← Back
          </Button>
          <h1 className="text-xl font-bold text-charcoal">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingProduct(null) }}
        />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Products</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{products.length} total products</p>
        </div>
        <Button variant="cinnamon" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or SKU..."
          className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cinnamon/30"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-cinnamon border-t-transparent mx-auto" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-charcoal font-medium">No products found</p>
            <p className="text-muted-foreground text-sm mt-1">Add your first product to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Product</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Price</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Stock</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => {
                  const primaryImage = product.product_images?.find((i) => i.is_primary) || product.product_images?.[0]
                  const inventory = (product as any).inventory

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                            {primaryImage ? (
                              <Image
                                src={primaryImage.url}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-lg">🌿</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-charcoal text-sm">{product.name}</p>
                            {product.sku && (
                              <p className="text-muted-foreground text-xs">SKU: {product.sku}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {(product as any).categories?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-cinnamon text-sm">{formatPrice(product.price)}</p>
                          {product.compare_price && (
                            <p className="text-muted-foreground text-xs line-through">{formatPrice(product.compare_price)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          !inventory ? 'bg-gray-100 text-gray-600'
                          : inventory.quantity === 0 ? 'bg-red-100 text-red-600'
                          : inventory.quantity < inventory.low_stock_threshold ? 'bg-amber-100 text-amber-600'
                          : 'bg-tea/10 text-tea'
                        }`}>
                          {inventory ? `${inventory.quantity} units` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                            product.is_active ? 'text-tea hover:text-tea-dark' : 'text-muted-foreground hover:text-charcoal'
                          }`}
                        >
                          {product.is_active ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                          {product.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
