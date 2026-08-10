import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { isApiConfigured, getToken } from '../lib/apiClient.js'
import { listFavorites, addFavorite, removeFavorite } from '../lib/api/favorites.js'

// Local-first favorites: works out of the box in demo mode (persisted to
// localStorage) and for guest browsing, and syncs to the backend in the
// background whenever a signed-in session exists.
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      productIds: [],

      // Called once after login (and on app boot if a session already
      // exists) so a signed-in user's favorites follow them across devices.
      hydrateFromServer: async () => {
        if (!isApiConfigured || !getToken()) return
        try {
          const ids = await listFavorites()
          set({ productIds: ids })
        } catch {
          // Keep whatever's in local storage if the fetch fails.
        }
      },

      isFavorite: (productId) => get().productIds.includes(productId),

      toggleFavorite: (productId) => {
        const wasFavorite = get().productIds.includes(productId)

        set((state) =>
          wasFavorite
            ? { productIds: state.productIds.filter((id) => id !== productId) }
            : { productIds: [...state.productIds, productId] }
        )

        if (isApiConfigured && getToken()) {
          const sync = wasFavorite ? removeFavorite(productId) : addFavorite(productId)
          sync.catch(() => {
            // Best-effort sync — local state already reflects the toggle.
          })
        }
      },

      clearFavorites: () => set({ productIds: [] }),
    }),
    {
      name: 'tayaar-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
