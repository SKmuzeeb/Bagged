import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isApiConfigured, getToken, setToken, clearToken } from '../lib/apiClient.js'
import { requestMagicLink, verifyMagicLink, getCurrentUser } from '../lib/api/auth.js'
import { useFavoritesStore } from './favoritesStore.js'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      status: 'idle', // idle | sending | sent | error
      error: null,

      sendMagicLink: async (email) => {
        set({ status: 'sending', error: null })

        if (!isApiConfigured) {
          // Demo mode: no backend configured, so simulate the "check your
          // inbox" flow without sending anything.
          await new Promise((resolve) => setTimeout(resolve, 600))
          set({ status: 'sent' })
          return { ok: true, demo: true }
        }

        try {
          await requestMagicLink(email)
          set({ status: 'sent' })
          return { ok: true }
        } catch (err) {
          set({ status: 'error', error: err.message })
          return { ok: false, error: err.message }
        }
      },

      // Called by the /auth/callback page once it has the ?token= from the
      // emailed magic link. Exchanges it for a session token and signs in.
      verifySession: async (linkToken) => {
        try {
          const { token, user } = await verifyMagicLink(linkToken)
          setToken(token)
          set({ user, status: 'idle', error: null })
          useFavoritesStore.getState().hydrateFromServer()
          return { ok: true }
        } catch (err) {
          return { ok: false, error: err.message }
        }
      },

      setUser: (user) => set({ user }),

      signOut: () => {
        clearToken()
        set({ user: null, status: 'idle', error: null })
      },

      reset: () => set({ status: 'idle', error: null }),
    }),
    { name: 'tayaar-auth', partialize: (state) => ({ user: state.user }) }
  )
)

if (isApiConfigured && getToken()) {
  getCurrentUser()
    .then((user) => useAuthStore.getState().setUser(user))
    .then(() => useFavoritesStore.getState().hydrateFromServer())
    .catch(() => {
      // Session token expired or invalid — drop it and fall back to signed-out.
      clearToken()
      useAuthStore.getState().setUser(null)
    })
}
