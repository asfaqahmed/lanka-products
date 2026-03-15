'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Eye, Package, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { OrderWithItems } from '@/lib/supabase/types'

const ORDER_STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const
type OrderStatus = typeof ORDER_STATUSES[number]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-purple-100 text-purple-700 border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  refunded: 'bg-gray-100 text-gray-700 border-gray-200',
}

const NEXT_STATUSES: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [trackingInput, setTrackingInput] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  const loadOrders = async () => {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data } = await query
    setOrders((data || []) as OrderWithItems[])
    setIsLoading(false)
  }

  useEffect(() => {
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setIsUpdating(true)
    const { error } = await (supabase.from('orders') as any)
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status: newStatus as any } : o))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any })
      }
      toast({ title: `Order status updated to ${newStatus}` })
    }
    setIsUpdating(false)
  }

  const handleTrackingUpdate = async (orderId: string) => {
    if (!trackingInput.trim()) return

    setIsUpdating(true)
    const { error } = await (supabase.from('orders') as any)
      .update({ tracking_number: trackingInput.trim() })
      .eq('id', orderId)

    if (!error) {
      setOrders(orders.map((o) => o.id === orderId ? { ...o, tracking_number: trackingInput } : o))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, tracking_number: trackingInput })
      }
      toast({ title: 'Tracking number updated' })
    }
    setIsUpdating(false)
  }

  const filteredOrders = orders.filter((order) =>
    order.order_number.toLowerCase().includes(search.toLowerCase()) ||
    order.shipping_email.toLowerCase().includes(search.toLowerCase()) ||
    order.shipping_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Orders</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number, email, or name..."
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cinnamon/30"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-cinnamon text-white'
                  : 'bg-white border border-border text-muted-foreground hover:text-charcoal'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-cinnamon border-t-transparent mx-auto" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No orders found matching your filters
            </div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {filteredOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => { setSelectedOrder(order); setTrackingInput(order.tracking_number || '') }}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedOrder?.id === order.id ? 'bg-cream' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-semibold text-cinnamon text-sm">{order.order_number}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-charcoal text-sm">{order.shipping_name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{order.shipping_country}</p>
                    <p className="font-bold text-charcoal text-sm">{formatPrice(order.total)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Order Detail Panel */}
        <div>
          {selectedOrder ? (
            <div className="bg-white rounded-xl border border-border p-5 space-y-5">
              <div>
                <h2 className="font-bold text-charcoal text-lg">Order Details</h2>
                <p className="text-cinnamon font-semibold">{selectedOrder.order_number}</p>
              </div>

              {/* Status Badges */}
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[selectedOrder.status]}`}>
                  Order: {selectedOrder.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  selectedOrder.payment_status === 'paid'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                }`}>
                  Payment: {selectedOrder.payment_status}
                </span>
              </div>

              {/* Status Update */}
              {NEXT_STATUSES[selectedOrder.status]?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-charcoal mb-2">Update Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {NEXT_STATUSES[selectedOrder.status].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        className={`capitalize text-xs ${status === 'cancelled' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-tea/30 text-tea hover:bg-tea/5'}`}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                      >
                        Mark {status}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracking Number */}
              <div>
                <p className="text-sm font-medium text-charcoal mb-2">Tracking Number</p>
                <div className="flex gap-2">
                  <input
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Enter tracking number"
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cinnamon"
                  />
                  <Button
                    size="sm"
                    variant="cinnamon"
                    disabled={isUpdating}
                    onClick={() => handleTrackingUpdate(selectedOrder.id)}
                  >
                    Save
                  </Button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-cream rounded-lg p-4">
                <h3 className="font-semibold text-charcoal text-sm mb-3">Shipping Address</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-charcoal">{selectedOrder.shipping_name}</p>
                  <p>{selectedOrder.shipping_email}</p>
                  {selectedOrder.shipping_phone && <p>{selectedOrder.shipping_phone}</p>}
                  <p>{selectedOrder.shipping_address_line1}</p>
                  {selectedOrder.shipping_address_line2 && <p>{selectedOrder.shipping_address_line2}</p>}
                  <p>{selectedOrder.shipping_city}{selectedOrder.shipping_state ? ', ' + selectedOrder.shipping_state : ''} {selectedOrder.shipping_postal_code}</p>
                  <p>{selectedOrder.shipping_country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-charcoal text-sm mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-charcoal">
                        {formatPrice(item.total_price)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-3 pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(selectedOrder.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-cinnamon">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <Eye className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
