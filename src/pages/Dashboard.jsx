import React, { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { SensexStraddle } from '../components/trading/SensexStraddle'
import { PositionsTable } from '../components/trading/PositionsTable'
import { MarketOverview } from '../components/dashboard/MarketOverview'
import { Header } from '../components/layout/Header'
import { useMarketStore } from '../stores/marketStore'
import { useAuthStore } from '../stores/authStore'

export function Dashboard() {
  const { fetchSensexPrice, setConnectionStatus } = useMarketStore()
  const { user } = useAuthStore()

  useEffect(() => {
    // Initial fetch
    fetchSensexPrice()
    
    // Set up 30-second polling for live data
    const interval = setInterval(() => {
      fetchSensexPrice()
    }, 30000) // 30 seconds as specified in the prompt

    return () => {
      clearInterval(interval)
      setConnectionStatus(false)
    }
  }, [fetchSensexPrice, setConnectionStatus])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.email?.split('@')[0] || 'Trader'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor your algorithmic trading strategies and market positions
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Strategy and Positions */}
          <div className="xl:col-span-3 space-y-8">
            <SensexStraddle />
            <PositionsTable />
          </div>
          
          {/* Right Column - Market Overview */}
          <div className="xl:col-span-1">
            <MarketOverview />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's P&L</p>
                <p className="text-2xl font-bold text-green-600">+₹2,450</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">73%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Return</p>
                <p className="text-2xl font-bold text-gray-900">12.5%</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}