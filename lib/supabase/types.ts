export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          origin_story: string | null
          price: number
          compare_price: number | null
          category_id: string | null
          weight_grams: number | null
          sku: string | null
          is_featured: boolean
          is_active: boolean
          meta_title: string | null
          meta_description: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          origin_story?: string | null
          price: number
          compare_price?: number | null
          category_id?: string | null
          weight_grams?: number | null
          sku?: string | null
          is_featured?: boolean
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          origin_story?: string | null
          price?: number
          compare_price?: number | null
          category_id?: string | null
          weight_grams?: number | null
          sku?: string | null
          is_featured?: boolean
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          quantity: number
          low_stock_threshold: number
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity?: number
          low_stock_threshold?: number
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          low_stock_threshold?: number
          updated_at?: string
        }
      }
      gift_boxes: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          price: number
          is_customizable: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          price: number
          is_customizable?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          price?: number
          is_customizable?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      gift_box_items: {
        Row: {
          id: string
          gift_box_id: string
          product_id: string
          quantity: number
          is_required: boolean
          created_at: string
        }
        Insert: {
          id?: string
          gift_box_id: string
          product_id: string
          quantity?: number
          is_required?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          gift_box_id?: string
          product_id?: string
          quantity?: number
          is_required?: boolean
          created_at?: string
        }
      }
      shipping_rates: {
        Row: {
          id: string
          country_code: string
          country_name: string
          rate: number
          min_days: number
          max_days: number
          free_shipping_threshold: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          country_code: string
          country_name: string
          rate: number
          min_days: number
          max_days: number
          free_shipping_threshold?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          country_code?: string
          country_name?: string
          rate?: number
          min_days?: number
          max_days?: number
          free_shipping_threshold?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string | null
          payhere_order_id: string | null
          subtotal: number
          shipping_cost: number
          total: number
          currency: string
          shipping_name: string
          shipping_email: string
          shipping_phone: string | null
          shipping_address_line1: string
          shipping_address_line2: string | null
          shipping_city: string
          shipping_state: string | null
          shipping_postal_code: string
          shipping_country: string
          shipping_country_code: string
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payhere_order_id?: string | null
          subtotal: number
          shipping_cost?: number
          total: number
          currency?: string
          shipping_name: string
          shipping_email: string
          shipping_phone?: string | null
          shipping_address_line1: string
          shipping_address_line2?: string | null
          shipping_city: string
          shipping_state?: string | null
          shipping_postal_code: string
          shipping_country: string
          shipping_country_code: string
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payhere_order_id?: string | null
          subtotal?: number
          shipping_cost?: number
          total?: number
          currency?: string
          shipping_name?: string
          shipping_email?: string
          shipping_phone?: string | null
          shipping_address_line1?: string
          shipping_address_line2?: string | null
          shipping_city?: string
          shipping_state?: string | null
          shipping_postal_code?: string
          shipping_country?: string
          shipping_country_code?: string
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          gift_box_id: string | null
          name: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          gift_box_id?: string | null
          name: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          gift_box_id?: string | null
          name?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string | null
          rating: number
          title: string | null
          body: string | null
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id?: string | null
          rating: number
          title?: string | null
          body?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string | null
          rating?: number
          title?: string | null
          body?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type Inventory = Database['public']['Tables']['inventory']['Row']
export type GiftBox = Database['public']['Tables']['gift_boxes']['Row']
export type GiftBoxItem = Database['public']['Tables']['gift_box_items']['Row']
export type ShippingRate = Database['public']['Tables']['shipping_rates']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Wishlist = Database['public']['Tables']['wishlists']['Row']

// Extended types with joins
export type ProductWithImages = Product & {
  product_images: ProductImage[]
  categories: Category | null
  inventory: Inventory | null
}

export type ProductWithDetails = ProductWithImages & {
  reviews: Review[]
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
}

export type GiftBoxWithItems = GiftBox & {
  gift_box_items: (GiftBoxItem & { products: Product })[]
}
