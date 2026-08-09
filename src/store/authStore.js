import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      status: 'idle', // idle | sending | sent | error
      error: null,

      sendMagicLink: async (email) => {
        set({ status: 'sending', error: null })

        if (!isSupabaseConfigured) {
          // Demo mode: no Supabase project configured, so simulate the
          // "check your inbox" flow without sending anything.
          await new Promise((resolve) => setTimeout(resolve, 600))
          set({ status: 'sent' })
          return { ok: true, demo: true }
        }

        try {
          const { error } = await supabase.auth.signInWithOtp({ email })
          if (error) throw error
          set({ status: 'sent' })
          return { ok: true }
        } catch (err) {
          set({ status: 'error', error: err.message })
          return { ok: false, error: err.message }
        }
      },

      setUser: (user) => set({ user }),

      signOut: async () => {
        if (isSupabaseConfigured) {
          await supabase.auth.signOut()
        }
        set({ user: null, status: 'idle', error: null })
      },

      reset: () => set({ status: 'idle', error: null }),
    }),
    { name: 'tayaar-auth', partialize: (state) => ({ user: state.user }) }
  )
)

if (isSupabaseConfigured) {
  supabase.auth.getSession().then(({ data }) => {
    if (data?.session?.user) {
      useAuthStore.getState().setUser(data.session.user)
    }
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setUser(session?.user ?? null)
  })
}
