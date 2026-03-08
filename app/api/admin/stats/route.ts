import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  const [
    { count: platesCount },
    { count: ordersCount },
    { data: pendingOrders },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('plates').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('orders')
      .select('id, customer_name, status, event_date, created_at, guest_count')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return NextResponse.json({
    platesCount: platesCount ?? 0,
    ordersCount: ordersCount ?? 0,
    pendingCount: pendingOrders?.length ?? 0,
    recentOrders: recentOrders ?? [],
  })
}
