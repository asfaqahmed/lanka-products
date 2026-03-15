'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Package, Heart, User, LogOut, ShoppingBag, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import type { Profile, OrderWithItems, Wishlist, Product } from '@/lib/supabase/types'

type DashboardTab = 'orders' | 'wishlist' | 'profile'

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-tea/10 text-tea',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    (searchParams.get('tab') as DashboardTab) || 'orders'
  )
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [wishlistProducts, setWishlistProducts] = useState<(Wishlist & { products: Product })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login?redirect=/dashboard')
        return
      }

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profileData)

      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setOrders((ordersData || []) as OrderWithItems[])

      // Load wishlist
      const { data: wishlistData } = await supabase
        .from('wishlists')
        .select('*, products(*, product_images(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setWishlistProducts((wishlistData || []) as any[])

      setIsLoading(false)
    }

    loadData()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-cinnamon border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border p-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-cinnamon/10 flex items-center justify-center mx-auto mb-3">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || 'User'}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-8 w-8 text-cinnamon" />
                  )}
                </div>
                <h2 className="font-semibold text-charcoal">
                  {profile?.full_name || 'Welcome!'}
                </h2>
                <p className="text-muted-foreground text-xs mt-0.5">{profile?.email}</p>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {[
                  { id: 'orders', icon: Package, label: 'My Orders', count: orders.length },
                  { id: 'wishlist', icon: Heart, label: 'Wishlist', count: wishlistProducts.length },
                  { id: 'profile', icon: User, label: 'Profile Settings', count: null },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as DashboardTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeTab === item.id
                        ? 'bg-cinnamon/10 text-cinnamon font-medium'
                        : 'text-charcoal hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count !== null && item.count > 0 && (
                      <span className="bg-cinnamon/10 text-cinnamon text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors mt-4"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h1 className="text-2xl font-serif font-bold text-charcoal mb-6">My Orders</h1>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-border p-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-charcoal mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start your Sri Lankan journey today!
                    </p>
                    <Link href="/shop">
                      <Button variant="cinnamon">Shop Now</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-xl border border-border p-5">
                        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Order</p>
                            <p className="font-bold text-cinnamon">{order.order_number}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="text-sm font-medium">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="font-bold text-charcoal">{formatPrice(order.total)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="text-sm text-muted-foreground border-t border-border pt-3">
                          <p>{order.order_items?.length || 0} item(s) • Shipping to {order.shipping_country}</p>
                          {order.tracking_number && (
                            <p className="text-tea font-medium mt-1">
                              Tracking: {order.tracking_number}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h1 className="text-2xl font-serif font-bold text-charcoal mb-6">My Wishlist</h1>
                {wishlistProducts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-border p-12 text-center">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-charcoal mb-2">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-6">
                      Save your favourite Sri Lankan products here.
                    </p>
                    <Link href="/shop">
                      <Button variant="cinnamon">Explore Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistProducts.map((item: any) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.products.slug}`}
                        className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow group"
                      >
                        <div className="relative aspect-square bg-cream">
                          {item.products.product_images?.[0]?.url ? (
                            <Image
                              src={item.products.product_images[0].url}
                              alt={item.products.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">🌿</div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-sm text-charcoal line-clamp-2 group-hover:text-cinnamon transition-colors">
                            {item.products.name}
                          </p>
                          <p className="text-cinnamon font-bold text-sm mt-1">
                            {formatPrice(item.products.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h1 className="text-2xl font-serif font-bold text-charcoal mb-6">Profile Settings</h1>
                <div className="bg-white rounded-2xl border border-border p-6">
                  <ProfileForm profile={profile} onUpdate={setProfile} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileForm({
  profile,
  onUpdate,
}: {
  profile: Profile | null
  onUpdate: (profile: Profile) => void
}) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    const { data, error } = await (supabase as any)
      .from('profiles')
      .update({ full_name: fullName, phone })
      .eq('id', profile.id)
      .select()
      .single()

    if (!error && data) {
      onUpdate(data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }

    setIsSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-md">
      <div>
        <label className="text-sm font-medium text-charcoal block mb-1.5">Email</label>
        <input
          value={profile?.email || ''}
          disabled
          className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-gray-50 text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
      </div>
      <div>
        <label className="text-sm font-medium text-charcoal block mb-1.5">Full Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-charcoal block mb-1.5">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder="+1 (555) 000-0000"
          className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="cinnamon" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        {success && <span className="text-tea text-sm font-medium">Saved!</span>}
      </div>
    </form>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-cinnamon border-t-transparent" /></div>}>
      <DashboardContent />
    </Suspense>
  )
}
