import React, { useState, useEffect } from 'react'
import { useMarketStore } from '../../stores/marketStore'
import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react'
import { format } from 'date-fns'

// Mock positions data for demo
const mockPositions = [
  {
    id: '1',
    instrument: 'SENSEX 65000 CE',
    type: 'CALL',
    action: 'SELL',
    quantity: 25,
    entryPrice: 245.50,
    currentPrice: 189.75,
    pnl: 1393.75,
    status: 'OPEN',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    instrument: 'SENSEX 64900 PE',
    type: 'PUT',
    action: 'SELL',
    quantity: 25,
    entryPrice: 198.25,
    currentPrice: 156.50,
    pnl: 1043.75,
    status: 'OPEN',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '3',
    instrument: 'SENSEX 65100 CE',
    type: 'CALL',
    action: 'BUY',
    quantity: 25,
    entryPrice: 89.50,
    currentPrice: 67.25,
    pnl: 556.25,
    status: 'OPEN',
    time: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
  },
  {
    id: '4',
    instrument: 'SENSEX 64800 PE',
    type: 'PUT',
    action: 'BUY',
    quantity: 25,
    entryPrice: 78.75,
    currentPrice: 52.50,
    pnl: 656.25,
    status: 'OPEN',
    time: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
  }
]

export function PositionsTable() {
  const [positions, setPositions] = useState([])
  const { fetchPositions } = useMarketStore()

  useEffect(() => {
    // Use mock data for demo
    setPositions(mockPositions)
    
    // Simulate price updates
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => ({
        ...pos,
        currentPrice: pos.entryPrice + (Math.random() - 0.5) * 50,
        pnl: (pos.action === 'SELL' ? pos.entryPrice - pos.currentPrice : pos.currentPrice - pos.entryPrice) * pos.quantity
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0)

  if (positions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Open Positions</h2>
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No open positions</p>
          <p className="text-sm text-gray-500">Start a strategy to see positions here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Open Positions</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total P&L</div>
              <div className={`text-lg font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{totalPnL.toLocaleString('en-IN', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </div>
            </div>
            <div className={`p-2 rounded-lg ${totalPnL >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {totalPnL >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instrument
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entry
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                P&L
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {positions.map((position) => (
              <tr key={position.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {position.instrument}
                    </div>
                    <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      position.type === 'CALL' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {position.type}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    position.action === 'BUY' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {position.action}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {position.quantity}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  ₹{position.entryPrice.toFixed(2)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  ₹{position.currentPrice.toFixed(2)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm font-medium ${
                    position.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {position.pnl >= 0 ? '+' : ''}₹{position.pnl.toFixed(2)}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(position.time, 'HH:mm')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{positions.length} open positions</span>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Margin Used: ₹{(positions.length * 15000).toLocaleString()}
            </span>
            <span className={`font-medium ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Net P&L: {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}