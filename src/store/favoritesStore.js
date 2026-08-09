import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Local-first favorites, same pattern as cartStore: works out of the box in
// demo mode (persisted to localStorage), and is the natural place to sync
// to the `favorites` table once a real signed-in user exists.
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      productIds: [],

      isFavorite: (productId) => get().productIds.includes(productId),

      toggleFavorite: (productId) => {
        set((state) =>
          state.productIds.includes(productId)
            ? { productIds: state.productIds.filter((id) => id !== productId) }
            : { productIds: [...state.productIds, productId] }
        )
      },

      clearFavorites: () => set({ productIds: [] }),
    }),
    {
      name: 'tayaar-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
