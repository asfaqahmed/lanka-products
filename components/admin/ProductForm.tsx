'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Upload, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { Category, ProductWithImages } from '@/lib/supabase/types'

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug required'),
  short_description: z.string().max(300).optional(),
  description: z.string().max(5000).optional(),
  origin_story: z.string().max(3000).optional(),
  price: z.number().positive('Price must be positive'),
  compare_price: z.number().positive().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  weight_grams: z.number().int().positive().optional().nullable(),
  sku: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  meta_title: z.string().max(70).optional(),
  meta_description: z.string().max(160).optional(),
  tags: z.string().optional(), // comma-separated
  initial_stock: z.number().int().min(0).default(0),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product: ProductWithImages | null
  categories: Category[]
  onSave: () => void
  onCancel: () => void
}

export function ProductForm({ product, categories, onSave, onCancel }: ProductFormProps) {
  const [images, setImages] = useState<{ url: string; is_primary: boolean }[]>(
    product?.product_images?.map((img) => ({ url: img.url, is_primary: img.is_primary })) || []
  )
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      short_description: product?.short_description || '',
      description: product?.description || '',
      origin_story: product?.origin_story || '',
      price: product?.price || 0,
      compare_price: product?.compare_price || null,
      category_id: product?.category_id || null,
      weight_grams: product?.weight_grams || null,
      sku: product?.sku || '',
      is_featured: product?.is_featured ?? false,
      is_active: product?.is_active ?? true,
      meta_title: product?.meta_title || '',
      meta_description: product?.meta_description || '',
      tags: product?.tags?.join(', ') || '',
      initial_stock: 0,
    },
  })

  const nameValue = watch('name')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue('name', name)
    if (!product) {
      setValue('slug', slugify(name))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (!uploadError && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        setImages((prev) => [
          ...prev,
          { url: publicUrl, is_primary: prev.length === 0 },
        ])
      }
    }

    setUploadingImage(false)
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
        updated[0].is_primary = true
      }
      return updated
    })
  }

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_primary: i === index }))
    )
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true)

    const tagsArray = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    const productData = {
      name: data.name,
      slug: data.slug,
      short_description: data.short_description || null,
      description: data.description || null,
      origin_story: data.origin_story || null,
      price: data.price,
      compare_price: data.compare_price || null,
      category_id: data.category_id || null,
      weight_grams: data.weight_grams || null,
      sku: data.sku || null,
      is_featured: data.is_featured,
      is_active: data.is_active,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      tags: tagsArray,
    }

    let savedProductId = product?.id

    if (product) {
      // Update
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id)

      if (error) {
        toast({ title: 'Error updating product', description: error.message, variant: 'destructive' })
        setIsSaving(false)
        return
      }
    } else {
      // Create
      const { data: created, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()

      if (error || !created) {
        toast({ title: 'Error creating product', description: error?.message, variant: 'destructive' })
        setIsSaving(false)
        return
      }

      savedProductId = created.id

      // Create inventory record
      await supabase.from('inventory').insert({
        product_id: savedProductId,
        quantity: data.initial_stock,
      })
    }

    // Save images
    if (savedProductId && images.length > 0) {
      // Delete existing images
      await supabase.from('product_images').delete().eq('product_id', savedProductId)

      // Insert new images
      await supabase.from('product_images').insert(
        images.map((img, idx) => ({
          product_id: savedProductId!,
          url: img.url,
          is_primary: img.is_primary,
          sort_order: idx,
        }))
      )
    }

    toast({ title: product ? 'Product updated!' : 'Product created!' })
    onSave()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold text-charcoal mb-5">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-charcoal block mb-1.5">Product Name *</label>
            <input
              {...register('name')}
              onChange={handleNameChange}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal block mb-1.5">Slug *</label>
            <input
              {...register('slug')}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon font-mono"
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal block mb-1.5">Category</label>
            <select
              {...register('category_id')}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 bg-white"
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-charcoal block mb-1.5">Short Description</label>
            <textarea
              {...register('short_description')}
              rows={2}
              placeholder="Brief description shown in product cards (max 300 chars)"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-charcoal block mb-1.5">Full Description</label>
            <textarea
              {...register('description')}
              rows={6}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-charcoal block mb-1.5">Origin Story</label>
            <textarea
              {...register('origin_story')}
              rows={4}
              placeholder="The story behind this authentic Sri Lankan product..."
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold text-charcoal mb-5">Pricing & Inventory</h2>
        <div className="grid md:grid-cols-4 gap-5">
          <div>
            <label className="text-sm font-medium text-charcoal block mb-1.5">Price (USD) *</label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal block mb-1.5">Compare at Price</label>
            <input
              {...register('compare_price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal block mb-1.5">SKU</label>
            <input
              {...register('sku')}
              placeholder="LP-0001"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 font-mono"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal block mb-1.5">Weight (grams)</label>
            <input
              {...register('weight_grams', { valueAsNumber: true })}
              type="number"
              placeholder="0"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30"
            />
          </div>

          {!product && (
            <div>
              <label className="text-sm font-medium text-charcoal block mb-1.5">Initial Stock</label>
              <input
                {...register('initial_stock', { valueAsNumber: true })}
                type="number"
                defaultValue={0}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30"
              />
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="flex gap-6 mt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('is_active')} type="checkbox" className="rounded text-cinnamon" />
            <span className="text-sm font-medium text-charcoal">Active (visible in shop)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('is_featured')} type="checkbox" className="rounded text-cinnamon" />
            <span className="text-sm font-medium text-charcoal">Featured Product</span>
          </label>
        </div>

        {/* Tags */}
        <div className="mt-5">
          <label className="text-sm font-medium text-charcoal block mb-1.5">Tags (comma-separated)</label>
          <input
            {...register('tags')}
            placeholder="spice, organic, premium, gift"
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30"
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold text-charcoal mb-5">Product Images</h2>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
              <Image src={img.url} alt={`Product image ${idx + 1}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className={`text-xs font-medium px-1.5 py-0.5 rounded ${img.is_primary ? 'bg-gold text-charcoal' : 'bg-white text-charcoal hover:bg-gold'}`}
                >
                  {img.is_primary ? 'Primary' : 'Set'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-0.5 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              {img.is_primary && (
                <div className="absolute top-1 left-1 bg-gold text-charcoal text-xs font-bold px-1 rounded">P</div>
              )}
            </div>
          ))}

          <label className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-cinnamon hover:bg-cream transition-colors">
            {uploadingImage ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-cinnamon border-t-transparent" />
            ) : (
              <>
                <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add Image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
        </div>

        <p className="text-xs text-muted-foreground">
          Click &quot;Set&quot; to set an image as the primary product image. Accepts JPG, PNG, WebP.
        </p>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold text-charcoal mb-5">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-charcoal block mb-1.5">
              Meta Title <span className="text-muted-foreground font-normal">(max 70 chars)</span>
            </label>
            <input
              {...register('meta_title')}
              maxLength={70}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal block mb-1.5">
              Meta Description <span className="text-muted-foreground font-normal">(max 160 chars)</span>
            </label>
            <textarea
              {...register('meta_description')}
              rows={2}
              maxLength={160}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" variant="cinnamon" disabled={isSaving} size="lg">
          {isSaving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} size="lg">
          Cancel
        </Button>
      </div>
    </form>
  )
}
