import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// The customer's chosen city — drives which kiranas Stores.jsx shows. There
// is no map/delivery-radius concept here, just "which city am I in," since
// pickup only makes sense for a store you can actually walk into.
export const useLocationStore = create(
  persist(
    (set) => ({
      city: null,
      setCity: (city) => set({ city }),
    }),
    { name: 'tayaar-location' }
  )
)
