'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

const empty: Omit<Category, 'id' | 'created_at'> = {
  name: '',
  slug: '',
  description: '',
  sort_order: 0,
  is_active: true,
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ ...empty })
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const supabase = createClient()

  const loadCategories = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      setCategories(data ?? [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ ...empty })
    setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setEditing(cat)
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    })
    setShowForm(true)
  }

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: editing ? f.slug : slugify(name),
    }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Validation', description: 'Name is required', variant: 'destructive' })
      return
    }
    setIsSaving(true)
    if (editing) {
      const { error } = await (supabase as any)
        .from('categories')
        .update({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description || null,
          sort_order: Number(form.sort_order),
          is_active: form.is_active,
        })
        .eq('id', editing.id)
      setIsSaving(false)
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' })
        return
      }
      toast({ title: 'Saved', description: 'Category updated' })
    } else {
      const { error } = await (supabase as any)
        .from('categories')
        .insert({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description || null,
          sort_order: Number(form.sort_order),
          is_active: form.is_active,
        })
      setIsSaving(false)
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' })
        return
      }
      toast({ title: 'Created', description: 'Category added' })
    }
    setShowForm(false)
    loadCategories()
  }

  const handleDelete = async (id: string) => {
    const { error } = await (supabase as any)
      .from('categories')
      .delete()
      .eq('id', id)
    setDeleteId(null)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      return
    }
    toast({ title: 'Deleted', description: 'Category removed' })
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const toggleActive = async (cat: Category) => {
    const { error } = await (supabase as any)
      .from('categories')
      .update({ is_active: !cat.is_active })
      .eq('id', cat.id)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      return
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, is_active: !c.is_active } : c))
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={openNew} className="bg-cinnamon hover:bg-cinnamon-dark text-white gap-2">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-charcoal">
              {editing ? 'Edit Category' : 'New Category'}
            </h2>
            <button onClick={() => setShowForm(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Spices & Condiments"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="spices-condiments"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-charcoal mb-1">Description</label>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="Short description shown on category pages"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cinnamon/30 focus:border-cinnamon"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${
                    form.is_active ? 'bg-tea justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
                <span className="text-sm text-charcoal">Active</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-cinnamon hover:bg-cinnamon-dark text-white"
            >
              {isSaving ? 'Saving…' : 'Save Category'}
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-charcoal">Category</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal">Slug</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal">Order</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal">Status</th>
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
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  No categories yet. Add one above.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cinnamon/10 flex items-center justify-center flex-shrink-0">
                        <Tag className="h-4 w-4 text-cinnamon" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{cat.sort_order}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(cat)}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                        cat.is_active
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {cat.is_active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 rounded-lg hover:bg-cream text-muted-foreground hover:text-charcoal transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {deleteId === cat.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Confirm delete"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="p-1.5 rounded-lg hover:bg-cream text-muted-foreground transition-colors"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(cat.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
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
