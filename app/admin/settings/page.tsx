'use client'

import { useState, useEffect } from 'react'
import { Save, Globe, Truck, Star, Trash2, Plus, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/use-toast'

type Tab = 'shipping' | 'store' | 'reviews'

interface ShippingRate {
  id: string
  country_code: string
  country_name: string
  standard_rate: number
  express_rate: number
  free_shipping_threshold: number | null
  estimated_days_min: number
  estimated_days_max: number
}

interface ReviewRow {
  id: string
  product_id: string
  rating: number
  comment: string | null
  is_verified: boolean
  created_at: string
  product_name?: string
  user_email?: string
}

const STORE_DEFAULTS = {
  storeName: 'Lanka Products',
  storeEmail: 'hello@lankaproducts.com',
  storePhone: '+94 77 000 0000',
  storeAddress: '42 Galle Road, Colombo 03, Sri Lanka',
  currency: 'USD',
  taxRate: '0',
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>('shipping')
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([])
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null)
  const [rateForm, setRateForm] = useState<Partial<ShippingRate>>({})
  const [isSavingRate, setIsSavingRate] = useState(false)
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [storeForm, setStoreForm] = useState({ ...STORE_DEFAULTS })
  const [isSavingStore, setIsSavingStore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (tab === 'shipping') loadShipping()
    if (tab === 'reviews') loadReviews()
  }, [tab])

  const loadShipping = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('shipping_rates')
      .select('*')
      .order('country_name')
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' })
    else setShippingRates(data ?? [])
    setIsLoading(false)
  }

  const loadReviews = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('reviews')
      .select('*, products(name), profiles(email)')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      setIsLoading(false)
      return
    }
    const rows: ReviewRow[] = (data ?? []).map((r: any) => ({
      id: r.id,
      product_id: r.product_id,
      rating: r.rating,
      comment: r.comment,
      is_verified: r.is_verified,
      created_at: r.created_at,
      product_name: r.products?.name,
      user_email: r.profiles?.email,
    }))
    setReviews(rows)
    setIsLoading(false)
  }

  const openEditRate = (rate: ShippingRate) => {
    setEditingRate(rate)
    setRateForm({ ...rate })
  }

  const saveRate = async () => {
    if (!editingRate) return
    setIsSavingRate(true)
    const { error } = await (supabase as any)
      .from('shipping_rates')
      .update({
        standard_rate: Number(rateForm.standard_rate),
        express_rate: Number(rateForm.express_rate),
        free_shipping_threshold: rateForm.free_shipping_threshold
          ? Number(rateForm.free_shipping_threshold)
          : null,
        estimated_days_min: Number(rateForm.estimated_days_min),
        estimated_days_max: Number(rateForm.estimated_days_max),
      })
      .eq('id', editingRate.id)
    setIsSavingRate(false)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      return
    }
    toast({ title: 'Saved', description: `${editingRate.country_name} rates updated` })
    setEditingRate(null)
    loadShipping()
  }

  const deleteReview = async (id: string) => {
    const { error } = await (supabase as any).from('reviews').delete().eq('id', id)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      return
    }
    toast({ title: 'Deleted', description: 'Review removed' })
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  const verifyReview = async (review: ReviewRow) => {
    const { error } = await (supabase as any)
      .from('reviews')
      .update({ is_verified: !review.is_verified })
      .eq('id', review.id)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      return
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, is_verified: !r.is_verified } : r))
    )
  }

  const saveStoreSettings = async () => {
    setIsSavingStore(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsSavingStore(false)
    toast({ title: 'Saved', description: 'Store settings updated (UI only — connect to env/DB as needed)' })
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'shipping', label: 'Shipping Rates', icon: Truck },
    { id: 'store', label: 'Store Settings', icon: Globe },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-charcoal">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage store configuration</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-cream rounded-xl p-1 mb-6 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-muted-foreground hover:text-charcoal'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* SHIPPING RATES */}
      {tab === 'shipping' && (
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Loading…</p>
          ) : (
            shippingRates.map((rate) => (
              <div key={rate.id} className="bg-white rounded-xl border border-border p-5">
                {editingRate?.id === rate.id ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-charcoal">{rate.country_name}</h3>
                      <button onClick={() => setEditingRate(null)}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { key: 'standard_rate', label: 'Standard Rate (USD)' },
                        { key: 'express_rate', label: 'Express Rate (USD)' },
                        { key: 'free_shipping_threshold', label: 'Free Shipping From (USD)' },
                        { key: 'estimated_days_min', label: 'Min Days' },
                        { key: 'estimated_days_max', label: 'Max Days' },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-charcoal mb-1">
                            {label}
                          </label>
                          <input
                            type="number"
                            value={(rateForm as any)[key] ?? ''}
                            onChange={(e) =>
                              setRateForm((f) => ({ ...f, [key]: e.target.value }))
                            }
                            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline" onClick={() => setEditingRate(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={saveRate}
                        disabled={isSavingRate}
                        className="bg-cinnamon hover:bg-cinnamon-dark text-white"
                      >
                        {isSavingRate ? 'Saving…' : 'Save Rates'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-charcoal">{rate.country_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Standard ${rate.standard_rate} · Express ${rate.express_rate}
                        {rate.free_shipping_threshold &&
                          ` · Free over $${rate.free_shipping_threshold}`}
                        · {rate.estimated_days_min}–{rate.estimated_days_max} days
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditRate(rate)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* STORE SETTINGS */}
      {tab === 'store' && (
        <div className="bg-white rounded-xl border border-border p-6 max-w-2xl">
          <h2 className="font-semibold text-charcoal mb-5">Store Information</h2>
          <div className="space-y-4">
            {[
              { key: 'storeName', label: 'Store Name' },
              { key: 'storeEmail', label: 'Contact Email' },
              { key: 'storePhone', label: 'Phone Number' },
              { key: 'storeAddress', label: 'Address' },
              { key: 'currency', label: 'Default Currency' },
              { key: 'taxRate', label: 'Tax Rate (%)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-charcoal mb-1">{label}</label>
                <input
                  value={(storeForm as any)[key]}
                  onChange={(e) =>
                    setStoreForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button
              onClick={saveStoreSettings}
              disabled={isSavingStore}
              className="bg-cinnamon hover:bg-cinnamon-dark text-white gap-2"
            >
              <Save className="h-4 w-4" />
              {isSavingStore ? 'Saving…' : 'Save Settings'}
            </Button>
          </div>
        </div>
      )}

      {/* REVIEWS */}
      {tab === 'reviews' && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-charcoal">Review</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal">Product</th>
                <th className="text-center px-4 py-3 font-medium text-charcoal">Rating</th>
                <th className="text-center px-4 py-3 font-medium text-charcoal">Verified</th>
                <th className="text-center px-4 py-3 font-medium text-charcoal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    No reviews yet.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-b border-border last:border-0 hover:bg-cream/40">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-xs text-muted-foreground mb-1">{review.user_email ?? 'Unknown'}</p>
                      <p className="text-sm text-charcoal line-clamp-2">
                        {review.comment ?? <span className="italic text-muted-foreground">No comment</span>}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[160px] truncate">
                      {review.product_name ?? review.product_id}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-gold">{review.rating}</span>
                      <span className="text-muted-foreground text-xs">/5</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => verifyReview(review)}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border transition-colors ${
                          review.is_verified
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                        }`}
                      >
                        <Check className="h-3 w-3" />
                        {review.is_verified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
