'use client'

import { useState, useEffect } from 'react'
import { Search, User, ShieldCheck, ShieldOff, Mail, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

interface CustomerRow {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  order_count: number
  total_spent: number
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const supabase = createClient()

  const loadCustomers = async () => {
    setIsLoading(true)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      setIsLoading(false)
      return
    }

    // Fetch order aggregates for each customer
    const { data: orderAggs } = await (supabase as any)
      .from('orders')
      .select('user_id, total')
      .in('user_id', (profiles ?? []).map((p: any) => p.id))

    const aggMap: Record<string, { count: number; total: number }> = {}
    for (const row of orderAggs ?? []) {
      if (!aggMap[row.user_id]) aggMap[row.user_id] = { count: 0, total: 0 }
      aggMap[row.user_id].count += 1
      aggMap[row.user_id].total += Number(row.total)
    }

    const rows: CustomerRow[] = (profiles ?? []).map((p: any) => ({
      ...p,
      order_count: aggMap[p.id]?.count ?? 0,
      total_spent: aggMap[p.id]?.total ?? 0,
    }))

    setCustomers(rows)
    setIsLoading(false)
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const toggleRole = async (customer: CustomerRow) => {
    const newRole = customer.role === 'admin' ? 'customer' : 'admin'
    setIsUpdating(customer.id)
    const { error } = await (supabase as any)
      .from('profiles')
      .update({ role: newRole })
      .eq('id', customer.id)
    setIsUpdating(null)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      return
    }
    toast({ title: 'Updated', description: `${customer.email} is now ${newRole}` })
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, role: newRole } : c))
    )
  }

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.email.toLowerCase().includes(q) ||
      (c.full_name ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Customers</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {customers.length} registered users
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-charcoal">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal">Joined</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal">Orders</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal">Total Spent</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal">Role</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  Loading customers…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  No customers found.
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cinnamon/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-cinnamon" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">
                          {customer.full_name ?? '—'}
                        </p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(customer.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium text-charcoal">{customer.order_count}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-charcoal">
                    {formatPrice(customer.total_spent)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${
                        customer.role === 'admin'
                          ? 'bg-cinnamon/10 text-cinnamon border-cinnamon/20'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {customer.role === 'admin' ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {customer.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={`mailto:${customer.email}`}
                        title="Send email"
                        className="p-1.5 rounded-lg hover:bg-cream text-muted-foreground hover:text-charcoal transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => toggleRole(customer)}
                        disabled={isUpdating === customer.id}
                        title={customer.role === 'admin' ? 'Remove admin' : 'Make admin'}
                        className="p-1.5 rounded-lg hover:bg-cream text-muted-foreground hover:text-charcoal transition-colors disabled:opacity-50"
                      >
                        {customer.role === 'admin' ? (
                          <ShieldOff className="h-4 w-4" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
