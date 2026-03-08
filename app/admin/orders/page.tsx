'use client'

import { useEffect, useState } from 'react'

interface OrderItem {
  id: string
  quantity: number
  price_at_order: number
  plates: { id: string; name_en: string; name_fr: string; name_ar: string; image_url: string | null } | null
}

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  event_date: string
  event_type: string
  guest_count: number
  notes: string | null
  status: string
  created_at: string
  order_items: OrderItem[]
}

const STATUS_FLOW: Record<string, string[]> = {
  pending: ['accepted', 'rejected'],
  accepted: ['preparing'],
  preparing: ['ready'],
  ready: ['delivered'],
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-emerald-100 text-emerald-800',
  delivered: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-800',
}

const STATUS_BTN: Record<string, string> = {
  accepted: 'bg-blue-600 hover:bg-blue-700 text-white',
  rejected: 'bg-red-600 hover:bg-red-700 text-white',
  preparing: 'bg-purple-600 hover:bg-purple-700 text-white',
  ready: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  delivered: 'bg-gray-600 hover:bg-gray-700 text-white',
}

const FILTERS = ['all', 'pending', 'accepted', 'preparing', 'ready', 'delivered', 'rejected']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: string) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
    }
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#064e3b]" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
              filter === f
                ? 'bg-[#064e3b] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? `All (${orders.length})` : `${f} (${orders.filter(o => o.status === f).length})`}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500">No {filter === 'all' ? '' : filter} orders</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Order header row */}
              <div
                className="p-5 flex flex-wrap items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{order.customer_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.customer_email || order.customer_phone}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{order.event_type}</span> · {order.guest_count} guests
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(order.event_date).toLocaleDateString()}
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] || ''}`}>
                  {order.status}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === order.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Expanded details */}
              {expandedId === order.id && (
                <div className="border-t border-gray-100 p-5">
                  {/* Order items */}
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
                  <div className="space-y-3 mb-5">
                    {order.order_items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.plates?.image_url ? (
                          <img src={item.plates.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm">🍽️</div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.plates?.name_en || 'Unknown plate'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} × {Number(item.price_at_order).toFixed(2)} TND
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {(item.quantity * Number(item.price_at_order)).toFixed(2)} TND
                        </p>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-gray-100 flex justify-between">
                      <span className="text-sm font-semibold text-gray-700">Total</span>
                      <span className="text-sm font-bold text-gray-900">
                        {order.order_items.reduce((sum, i) => sum + i.quantity * Number(i.price_at_order), 0).toFixed(2)} TND
                      </span>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-sm">
                    <div>
                      <span className="text-gray-500">Phone:</span>{' '}
                      <span className="text-gray-900">{order.customer_phone || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>{' '}
                      <span className="text-gray-900">{order.customer_email || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ordered:</span>{' '}
                      <span className="text-gray-900">{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-5 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                      <span className="font-medium">Notes:</span> {order.notes}
                    </div>
                  )}

                  {/* Status actions */}
                  {STATUS_FLOW[order.status] && (
                    <div className="flex gap-2">
                      {STATUS_FLOW[order.status].map(nextStatus => (
                        <button
                          key={nextStatus}
                          onClick={() => updateStatus(order.id, nextStatus)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${STATUS_BTN[nextStatus] || 'bg-gray-200'}`}
                        >
                          {nextStatus === 'accepted' ? 'Accept' :
                           nextStatus === 'rejected' ? 'Reject' :
                           `Mark ${nextStatus}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
