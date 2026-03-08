import { createAdminClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
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

  const stats = [
    { label: 'Total Plates', value: platesCount ?? 0, icon: '🍽️', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Total Orders', value: ordersCount ?? 0, icon: '📋', color: 'bg-blue-50 text-blue-700' },
    { label: 'Pending Orders', value: pendingOrders?.length ?? 0, icon: '⏳', color: 'bg-amber-50 text-amber-700' },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    accepted: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready: 'bg-emerald-100 text-emerald-800',
    delivered: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Event Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Guests</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.event_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.guest_count}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p>No orders yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
