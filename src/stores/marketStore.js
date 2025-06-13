import { create } from 'zustand'
import { dhanhqService } from '../services/dhanhq'

export const useMarketStore = create((set, get) => ({
  // Market data
  sensexPrice: null,
  sensexChange: 0,
  sensexChangePercent: 0,
  lastUpdate: null,
  
  // Trading data
  positions: [],
  orders: [],
  executions: [],
  
  // Connection status
  isConnected: false,
  isLoading: false,
  
  // Actions
  updateSensexPrice: (data) => set({
    sensexPrice: data.price || data.sensex, // Handle both formats
    sensexChange: data.change || 0,
    sensexChangePercent: data.changePercent || 0,
    lastUpdate: data.timestamp || new Date().toISOString()
  }),
  
  updatePositions: (positions) => set({ positions }),
  updateOrders: (orders) => set({ orders }),
  updateExecutions: (executions) => set({ executions }),
  setConnectionStatus: (status) => set({ isConnected: status }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Async actions
  fetchSensexPrice: async () => {
    try {
      set({ isLoading: true })
      const data = await dhanhqService.getSensexPrice()
      get().updateSensexPrice(data)
      
      // Set connection status based on data source
      if (data._isLiveData) {
        set({ isConnected: true })
      } else if (data._isMockData) {
        set({ isConnected: false })
      }
      
    } catch (error) {
      console.error('Failed to fetch Sensex price:', error)
      set({ isConnected: false })
    } finally {
      set({ isLoading: false })
    }
  },
  
  fetchPositions: async () => {
    try {
      const positions = await dhanhqService.getPositions()
      set({ positions })
    } catch (error) {
      console.error('Failed to fetch positions:', error)
    }
  },

  // Calculate total P&L
  getTotalPnL: () => {
    const { positions } = get()
    return positions.reduce((total, position) => total + (position.pnl || 0), 0)
  },

  // Get active executions count
  getActiveExecutionsCount: () => {
    const { executions } = get()
    return executions.filter(exec => exec.status === 'ACTIVE').length
  }
}))