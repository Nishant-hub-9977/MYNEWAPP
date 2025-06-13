import React from 'react'
import { useMarketStore } from '../../stores/marketStore'
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react'
import { format } from 'date-fns'

export function MarketOverview() {
  const { 
    sensexPrice, 
    sensexChange, 
    sensexChangePercent, 
    lastUpdate, 
    isConnected,
    getTotalPnL,
    getActiveExecutionsCount 
  } = useMarketStore()

  const totalPnL = getTotalPnL()
  const activeExecutions = getActiveExecutionsCount()
  const isPositive = sensexChange >= 0

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Market Overview</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Sensex Price */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">SENSEX</span>
          {lastUpdate && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {format(new Date(lastUpdate), 'HH:mm:ss')}
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {sensexPrice ? sensexPrice.toLocaleString('en-IN', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              }) : '--'}
            </div>
            
            {sensexChange !== null && (
              <div className={`flex items-center mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {isPositive ? '+' : ''}{sensexChange.toFixed(2)} ({isPositive ? '+' : ''}{sensexChangePercent.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
            {isPositive ? (
              <TrendingUp className={`h-6 w-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
            ) : (
              <TrendingDown className={`h-6 w-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
            )}
          </div>
        </div>
      </div>

      {/* Trading Stats */}
      <div className="grid grid-cols-2 gap-4">
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
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
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