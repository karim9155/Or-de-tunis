'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface CartItem {
  plate_id: string
  name_en: string
  name_fr: string
  name_ar: string
  price: number
  image_url: string | null
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (plateId: string) => void
  updateQuantity: (plateId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextValue>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  itemCount: 0,
})

const STORAGE_KEY = 'lordetunis_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, loaded])

  function addItem(item: Omit<CartItem, 'quantity'>, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.plate_id === item.plate_id)
      if (existing) {
        return prev.map(i =>
          i.plate_id === item.plate_id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { ...item, quantity: qty }]
    })
  }

  function removeItem(plateId: string) {
    setItems(prev => prev.filter(i => i.plate_id !== plateId))
  }

  function updateQuantity(plateId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(plateId)
      return
    }
    setItems(prev => prev.map(i => i.plate_id === plateId ? { ...i, quantity } : i))
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
