import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const countryCode = searchParams.get('country')?.toUpperCase()

  // No country param — return all active rates
  if (!countryCode) {
    try {
      const { data: rates, error } = await supabase
        .from('shipping_rates')
        .select('*')
        .eq('is_active', true)
        .order('country_name')

      if (error) throw error

      return NextResponse.json(rates || [])
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch shipping rates' },
        { status: 500 }
      )
    }
  }

  try {
    const { data: rate, error } = await supabase
      .from('shipping_rates')
      .select('*')
      .eq('country_code', countryCode)
      .eq('is_active', true)
      .single()

    if (error || !rate) {
      // Return a default rate for unsupported countries
      return NextResponse.json({
        country_code: countryCode,
        country_name: 'International',
        rate: 25.00,
        min_days: 14,
        max_days: 21,
        free_shipping_threshold: null,
        message: 'Standard international shipping',
      })
    }

    return NextResponse.json({
      ...rate,
      estimated_delivery: `${rate.min_days}–${rate.max_days} business days`,
      is_free_eligible: rate.free_shipping_threshold !== null,
    })
  } catch (error) {
    console.error('Shipping rate error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipping rate' },
      { status: 500 }
    )
  }
}
