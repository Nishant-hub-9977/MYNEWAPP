class UpstoxService {
  constructor() {
    this.baseURL = '/api/upstox'
    this.apiKey = import.meta.env.VITE_UPSTOX_API_KEY
    this.redirectUri = import.meta.env.VITE_UPSTOX_REDIRECT_URI
  }

  /**
   * Generate Upstox OAuth authorization URL
   */
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: this.apiKey,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'read'
    })

    return `https://api.upstox.com/oauth/authorize?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCode(code) {
    try {
      console.log('🔄 Exchanging authorization code for access token')
      
      const response = await fetch(`${this.baseURL}/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          client_id: this.apiKey,
          redirect_uri: this.redirectUri
        })
      })
      
      if (!response.ok) {
        console.error('❌ HTTP error:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Token exchange successful')
      
      return data
      
    } catch (error) {
      console.error('❌ Error exchanging code for token:', error)
      throw error
    }
  }

  /**
   * Get user profile using access token
   */
  async getUserProfile(accessToken) {
    try {
      console.log('👤 Fetching user profile from Upstox')
      
      const response = await fetch('https://api.upstox.com/user/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ User profile received')
      
      return data
      
    } catch (error) {
      console.error('❌ Error fetching user profile:', error)
      throw error
    }
  }

  /**
   * Get market data using access token
   */
  async getMarketData(accessToken, instruments) {
    try {
      console.log('📊 Fetching market data from Upstox')
      
      const response = await fetch('https://api.upstox.com/market-data/quotes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instruments: instruments
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Market data received')
      
      return data
      
    } catch (error) {
      console.error('❌ Error fetching market data:', error)
      throw error
    }
  }
}

export const upstoxService = new UpstoxService()