import { create } from 'zustand'

export const useMarketStore = create((set, get) => ({
  // Trading data
  positions: [],
  orders: [],
  executions: [],
  
  // Connection status
  isConnected: false,
  isLoading: false,
  
  // Actions
  updatePositions: (positions) => set({ positions }),
  updateOrders: (orders) => set({ orders }),
  updateExecutions: (executions) => set({ executions }),
  setConnectionStatus: (status) => set({ isConnected: status }),
  setLoading: (loading) => set({ isLoading: loading }),
  
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