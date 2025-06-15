import { create } from 'zustand'
import { upstoxService } from '../services/upstox'

export const useUpstoxStore = create((set, get) => ({
  // Auth state
  accessToken: null,
  isConnected: false,
  userProfile: null,
  
  // Market data
  marketData: {},
  
  // Connection status
  isLoading: false,
  error: null,

  // Actions
  setAccessToken: (token) => set({ 
    accessToken: token,
    isConnected: !!token,
    error: null 
  }),
  
  setConnectionStatus: (status) => set({ isConnected: status }),
  
  setUserProfile: (profile) => set({ userProfile: profile }),
  
  setMarketData: (data) => set({ marketData: data }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  // Async actions
  fetchUserProfile: async () => {
    const { accessToken } = get()
    if (!accessToken) return

    try {
      set({ isLoading: true, error: null })
      const profile = await upstoxService.getUserProfile(accessToken)
      set({ userProfile: profile })
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchMarketData: async (instruments) => {
    const { accessToken } = get()
    if (!accessToken) return

    try {
      set({ isLoading: true, error: null })
      const data = await upstoxService.getMarketData(accessToken, instruments)
      set({ marketData: data })
    } catch (error) {
      console.error('Failed to fetch market data:', error)
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  // Clear all data
  clearData: () => set({
    accessToken: null,
    isConnected: false,
    userProfile: null,
    marketData: {},
    error: null
  }),

  // Get authorization URL
  getAuthUrl: () => upstoxService.getAuthorizationUrl()
}))