import { createServerClient } from '@/lib/supabase/server'
import { ShoppingBag, Package, Users, DollarSign, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

async function getStats() {
  try {
    const supabase = createServerClient()

    const [
      { count: totalOrders },
      { count: totalProducts },
      { count: totalCustomers },
      { data: revenueData },
      { data: recentOrders },
      { data: lowStock },
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase.from('orders').select('total').eq('payment_status', 'paid'),
      supabase
        .from('orders')
        .select('*, order_items(count)')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('inventory')
        .select('*, products(name, slug)')
        .lt('quantity', 10)
        .order('quantity'),
    ])

    const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

    return {
      totalOrders: totalOrders || 0,
      totalProducts: totalProducts || 0,
      totalCustomers: totalCustomers || 0,
      totalRevenue,
      recentOrders: recentOrders || [],
      lowStock: lowStock || [],
    }
  } catch {
    return {
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      totalRevenue: 0,
      recentOrders: [],
      lowStock: [],
    }
  }
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-tea/5 text-tea',
      iconBg: 'bg-tea/10',
    },
    {
      title: 'Active Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'bg-cinnamon/5 text-cinnamon',
      iconBg: 'bg-cinnamon/10',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'bg-gold/5 text-gold-dark',
      iconBg: 'bg-gold/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-charcoal mt-1">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                <card.icon className={`h-5 w-5 ${card.color.split(' ')[1]}`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-tea">
              <TrendingUp className="h-3 w-3" />
              <span>+12% this month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-semibold text-charcoal">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-cinnamon text-sm font-medium flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order: any) => (
                <div key={order.id} className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal text-sm">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">{order.shipping_email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ORDER_STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <p className="font-semibold text-charcoal text-sm">{formatPrice(order.total)}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No orders yet. Share your store to get started!
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-semibold text-charcoal flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Low Stock
            </h2>
            <Link
              href="/admin/products"
              className="text-cinnamon text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Manage <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {stats.lowStock.length > 0 ? (
              stats.lowStock.map((item: any) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">
                      {item.products?.name || 'Unknown'}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                    item.quantity === 0
                      ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    {item.quantity === 0 ? 'Out' : `${item.quantity} left`}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                All products are well-stocked!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-semibold text-charcoal mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/products?action=new', label: 'Add Product', icon: Package, color: 'border-cinnamon/30 text-cinnamon hover:bg-cinnamon/5' },
            { href: '/admin/orders', label: 'View Orders', icon: ShoppingBag, color: 'border-blue-200 text-blue-600 hover:bg-blue-50' },
            { href: '/admin/customers', label: 'View Customers', icon: Users, color: 'border-tea/30 text-tea hover:bg-tea/5' },
            { href: '/admin/settings', label: 'Settings', icon: Settings, color: 'border-gray-200 text-gray-600 hover:bg-gray-50' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors text-sm font-medium ${action.color}`}
            >
              <action.icon className="h-4 w-4 flex-shrink-0" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
