import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

function round(n) {
  return Math.round(n * 100) / 100
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      kiranaId: null,
      items: [],

      /**
       * Adds one `step` worth of a product to the cart. Returns false
       * without changing state if the product is out of stock. Since the
       * cart is single-vendor, adding a product from a different kirana
       * than what's already in the cart replaces the cart contents.
       */
      addItem: (productToAdd) => {
        if (!productToAdd || productToAdd.in_stock === false) return false

        set((state) => {
          const switchingKirana = state.kiranaId && state.kiranaId !== productToAdd.kirana_id
          const items = switchingKirana ? [] : state.items
          const step = productToAdd.step ?? 1
          const existing = items.find((item) => item.productId === productToAdd.id)

          if (existing) {
            return {
              kiranaId: productToAdd.kirana_id,
              items: items.map((item) =>
                item.productId === productToAdd.id
                  ? { ...item, quantity: round(item.quantity + step) }
                  : item
              ),
            }
          }

          const initialQuantity = round(productToAdd.min_order_qty ?? step)
          return {
            kiranaId: productToAdd.kirana_id,
            items: [
              ...items,
              {
                productId: productToAdd.id,
                name: productToAdd.name,
                name_hindi: productToAdd.name_hindi,
                price_rupees: productToAdd.price_rupees,
                unit: productToAdd.unit,
                step,
                image_url: productToAdd.image_url,
                quantity: initialQuantity,
              },
            ],
          }
        })

        return true
      },

      incrementItem: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: round(item.quantity + item.step) } : item
          ),
        }))
      },

      decrementItem: (productId) => {
        set((state) => {
          const item = state.items.find((i) => i.productId === productId)
          if (!item) return state

          const nextQuantity = round(item.quantity - item.step)
          if (nextQuantity <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) }
          }
          return {
            items: state.items.map((i) => (i.productId === productId ? { ...i, quantity: nextQuantity } : i)),
          }
        })
      },

      setQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) }
          }
          return {
            items: state.items.map((i) => (i.productId === productId ? { ...i, quantity: round(quantity) } : i)),
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }))
      },

      clearCart: () => set({ items: [], kiranaId: null }),

      getCount: () => get().items.length,
      getTotalQuantity: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotal: () => round(get().items.reduce((sum, item) => sum + item.quantity * item.price_rupees, 0)),
    }),
    {
      name: 'tayaar-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
