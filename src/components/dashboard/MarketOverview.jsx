import React from 'react'
import { useMarketStore } from '../../stores/marketStore'
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react'

export function MarketOverview() {
  const { 
    isConnected,
    getTotalPnL,
    getActiveExecutionsCount 
  } = useMarketStore()

  const totalPnL = getTotalPnL()
  const activeExecutions = getActiveExecutionsCount()

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Market Overview</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Market Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">SENSEX</h3>
            <p className="text-2xl font-bold text-blue-800">65,000.00</p>
            <div className="flex items-center mt-1 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">+150.25 (+0.23%)</span>
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Trading Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total P&L</p>
              <p className={`text-lg font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{totalPnL.toLocaleString('en-IN', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${totalPnL >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <TrendingUp className={`h-5 w-5 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Strategies</p>
              <p className="text-lg font-bold text-gray-900">{activeExecutions}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Market Status */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-blue-800 font-medium">Market Open</span>
          </div>
          <span className="text-sm text-blue-600">
            Closes at 3:30 PM IST
          </span>
        </div>
      </div>
    </div>
  )
}