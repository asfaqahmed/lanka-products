import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyPayhereNotification } from '@/lib/payhere'
import { sendOrderStatusUpdate } from '@/lib/email'
import type { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const merchant_id = formData.get('merchant_id') as string
    const order_id = formData.get('order_id') as string
    const payhere_amount = formData.get('payhere_amount') as string
    const payhere_currency = formData.get('payhere_currency') as string
    const status_code = formData.get('status_code') as string
    const md5sig = formData.get('md5sig') as string
    const method = formData.get('method') as string

    // Validate required fields
    if (!merchant_id || !order_id || !payhere_amount || !payhere_currency || !status_code || !md5sig) {
      console.error('PayHere: Missing required fields')
      return new NextResponse('Bad Request', { status: 400 })
    }

    // Verify the hash signature
    const isValid = verifyPayhereNotification({
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    })

    if (!isValid) {
      console.error('PayHere: Invalid hash signature for order', order_id)
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Map PayHere status codes to our statuses
    const statusMap: Record<string, { payment_status: string; order_status: string }> = {
      '2': { payment_status: 'paid', order_status: 'confirmed' },
      '0': { payment_status: 'pending', order_status: 'pending' },
      '-1': { payment_status: 'failed', order_status: 'cancelled' },
      '-2': { payment_status: 'failed', order_status: 'cancelled' },
      '-3': { payment_status: 'refunded', order_status: 'refunded' },
    }

    const statusUpdate = statusMap[status_code]

    if (!statusUpdate) {
      console.error('PayHere: Unknown status code', status_code)
      return new NextResponse('OK', { status: 200 })
    }

    // Update the order in our database
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', order_id)
      .single()

    if (fetchError || !order) {
      console.error('PayHere: Order not found:', order_id)
      return new NextResponse('OK', { status: 200 }) // Return 200 to stop PayHere retries
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: statusUpdate.payment_status as 'pending' | 'paid' | 'failed' | 'refunded',
        status: statusUpdate.order_status as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded',
        payment_method: method || 'card',
        payhere_order_id: order_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    if (updateError) {
      console.error('PayHere: Failed to update order:', updateError)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    // Decrement inventory for paid orders
    if (status_code === '2') {
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', order.id)
        .not('product_id', 'is', null)

      if (orderItems) {
        for (const item of orderItems) {
          if (item.product_id) {
            await supabase.rpc('decrement_inventory', {
              p_product_id: item.product_id,
              p_quantity: item.quantity,
            }).catch(() => {
              // RPC might not exist, use manual update
              supabase
                .from('inventory')
                .select('quantity')
                .eq('product_id', item.product_id!)
                .single()
                .then(({ data: inv }) => {
                  if (inv) {
                    supabase
                      .from('inventory')
                      .update({ quantity: Math.max(0, inv.quantity - item.quantity) })
                      .eq('product_id', item.product_id!)
                  }
                })
            })
          }
        }
      }

      // Send order status update email
      try {
        await sendOrderStatusUpdate(order, 'confirmed')
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
      }
    }

    console.log(`PayHere: Order ${order_id} updated to status ${statusUpdate.order_status}`)
    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('PayHere notification error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
