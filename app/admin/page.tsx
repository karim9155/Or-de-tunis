'use client'

import { useEffect, useState } from 'react'
import { useLanguage, translations } from '@/context/language-context'

interface RecentOrder {
  id: string
  customer_name: string
  status: string
  event_date: string
  created_at: string
  guest_count: number
}

export default function AdminDashboardPage() {
  const { language } = useLanguage()
  const t = translations[language].admin.dashboard
  const tOrders = translations[language].admin.orders

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    platesCount: number
    ordersCount: number
    pendingCount: number
    recentOrders: RecentOrder[]
  }>({ platesCount: 0, ordersCount: 0, pendingCount: 0, recentOrders: [] })

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  const stats = [
    { label: t.totalPlates, value: data.platesCount, icon: '🍽️', color: 'bg-emerald-50 text-emerald-700' },
    { label: t.totalOrders, value: data.ordersCount, icon: '📋', color: 'bg-blue-50 text-blue-700' },
    { label: t.pendingOrders, value: data.pendingCount, icon: '⏳', color: 'bg-amber-50 text-amber-700' },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    accepted: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready: 'bg-emerald-100 text-emerald-800',
    delivered: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#064e3b]" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.title}</h1>

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
          <h2 className="text-lg font-semibold text-gray-900">{t.recentOrders}</h2>
        </div>
        {data.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.customer}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.eventDate}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.guests}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.event_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.guest_count}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {tOrders[order.status as keyof typeof tOrders] || order.status}
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
            <p>{t.noOrders}</p>
          </div>
        )}
      </div>
    </div>
  )
}
