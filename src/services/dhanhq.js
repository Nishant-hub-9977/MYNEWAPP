class DhanHQService {
  constructor() {
    this.baseURL = '/api/dhanhq'
    // Remove token from frontend - backend handles authentication
  }

  async getSensexPrice() {
    try {
      console.log('🔄 Fetching Sensex price from backend:', `${this.baseURL}/sensex-price`)
      
      const response = await fetch(`${this.baseURL}/sensex-price`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        console.error('❌ HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Sensex data received from backend:', data)
      
      // Transform backend response to match expected format
      return {
        price: data.sensex,
        timestamp: data.timestamp,
        change: 0, // Backend doesn't provide change data yet
        changePercent: 0, // Backend doesn't provide change percent yet
        volume: 1000000, // Mock data
        high: data.sensex + 200, // Mock data
        low: data.sensex - 200, // Mock data
        open: data.sensex, // Mock data
        _isLiveData: true
      }
      
    } catch (error) {
      console.error('❌ Error fetching Sensex price from backend:', error)
      
      // Return mock data for demo purposes with error indication
      const mockData = {
        price: 65000 + Math.random() * 2000 - 1000,
        timestamp: new Date().toISOString(),
        change: Math.random() * 200 - 100,
        changePercent: Math.random() * 2 - 1,
        volume: 1000000,
        high: 65200,
        low: 64800,
        open: 65000,
        _isMockData: true,
        _error: error.message
      }
      
      console.warn('⚠️ Using mock data due to backend error:', mockData)
      return mockData
    }
  }

  async placeOrder(orderData) {
    try {
      console.log('📝 Placing order:', orderData)
      
      const response = await fetch(`${this.baseURL}/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('✅ Order placed successfully:', result)
      return result
      
    } catch (error) {
      console.error('❌ Error placing order:', error)
      throw error
    }
  }

  async getPositions() {
    try {
      console.log('📋 Fetching positions...')
      
      const response = await fetch(`${this.baseURL}/positions`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const positions = await response.json()
      console.log('✅ Positions received:', positions)
      return positions
      
    } catch (error) {
      console.error('❌ Error fetching positions:', error)
      return []
    }
  }

  async getOptionChain(index, expiry) {
    try {
      console.log(`⛓️ Fetching option chain for ${index} expiry ${expiry}`)
      
      const response = await fetch(`${this.baseURL}/option-chain?index=${index}&expiry=${expiry}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Option chain received:', data)
      return data
      
    } catch (error) {
      console.error('❌ Error fetching option chain:', error)
      return { calls: [], puts: [] }
    }
  }
}

export const dhanhqService = new DhanHQService()