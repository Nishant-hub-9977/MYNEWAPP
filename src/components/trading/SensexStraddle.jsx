import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMarketStore } from '../../stores/marketStore'
import { useAuthStore } from '../../stores/authStore'
import { db } from '../../services/supabase'
import { Play, Square, Settings, TrendingUp, AlertTriangle, Target } from 'lucide-react'

const straddleSchema = z.object({
  triggerPoints: z.number().min(50).max(1000),
  maxLoss: z.number().min(1000).max(100000),
  executionDay: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  executionTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  autoStart: z.boolean(),
  stopLossPercentage: z.number().min(100).max(500)
})

export function SensexStraddle() {
  const [isActive, setIsActive] = useState(false)
  const [execution, setExecution] = useState(null)
  const [strategies, setStrategies] = useState([])
  const [selectedStrategy, setSelectedStrategy] = useState(null)
  const { sensexPrice, fetchSensexPrice } = useMarketStore()
  const { user } = useAuthStore()
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(straddleSchema),
    defaultValues: {
      triggerPoints: 300,
      maxLoss: 10000,
      executionDay: 'Wednesday',
      executionTime: '09:30',
      autoStart: false,
      stopLossPercentage: 200
    }
  })

  const watchedValues = watch()

  useEffect(() => {
    fetchSensexPrice()
    loadStrategies()
  }, [])

  const loadStrategies = async () => {
    if (!user) return
    
    try {
      const { data, error } = await db.getStraddleStrategies(user.id)
      if (!error && data) {
        setStrategies(data)
      }
    } catch (error) {
      console.error('Error loading strategies:', error)
    }
  }

  const saveStrategy = async (data) => {
    if (!user) return
    
    try {
      const { data: strategy, error } = await db.createStraddleStrategy(user.id, {
        trigger_points: data.triggerPoints,
        max_loss_per_trade: data.maxLoss,
        execution_day: data.executionDay,
        execution_time: data.executionTime,
        auto_start: data.autoStart,
        stop_loss_percentage: data.stopLossPercentage
      })

      if (!error && strategy) {
        setStrategies([...strategies, strategy])
        return strategy
      }
    } catch (error) {
      console.error('Error saving strategy:', error)
    }
  }

  const startStrategy = async (data) => {
    try {
      // Save strategy first
      const strategy = await saveStrategy(data)
      if (!strategy) return

      // Create mock execution for demo
      const mockExecution = {
        id: Math.random().toString(36).substr(2, 9),
        strategyId: strategy.id,
        initialPrice: sensexPrice,
        currentPrice: sensexPrice,
        currentPnL: 0,
        positionCount: 0,
        status: 'ACTIVE',
        startTime: new Date().toISOString()
      }

      setExecution(mockExecution)
      setIsActive(true)
      
      // Simulate position creation
      setTimeout(() => {
        setExecution(prev => ({
          ...prev,
          positionCount: 4, // 2 CALL sells + 2 PUT sells
          currentPnL: Math.random() * 2000 - 1000
        }))
      }, 2000)

    } catch (error) {
      console.error('Error starting strategy:', error)
    }
  }

  const stopStrategy = () => {
    setIsActive(false)
    setExecution(null)
  }

  const calculatePremium = (strikeDistance) => {
    const basePrice = sensexPrice || 65000
    const volatility = 0.15
    return Math.max(50, Math.random() * 200 + volatility * strikeDistance)
  }

  const getATMStrike = () => {
    if (!sensexPrice) return 65000
    return Math.round(sensexPrice / 100) * 100
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Sensex Straddle Strategy</h2>
            <p className="text-blue-100 mt-1">Automated option straddle execution</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-semibold">
                SENSEX: {sensexPrice ? sensexPrice.toLocaleString() : '--'}
              </div>
              <div className="text-sm text-blue-200">
                ATM Strike: {getATMStrike().toLocaleString()}
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`} />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Strategy Configuration */}
        <form onSubmit={handleSubmit(startStrategy)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Trigger Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="inline h-4 w-4 mr-1" />
                Trigger Points Movement
              </label>
              <input
                {...register('triggerPoints', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={50}
                max={1000}
                step={25}
              />
              <p className="text-xs text-gray-500 mt-1">
                Adjust positions when Sensex moves ±{watchedValues.triggerPoints} points
              </p>
              {errors.triggerPoints && (
                <p className="text-red-500 text-sm mt-1">{errors.triggerPoints.message}</p>
              )}
            </div>

            {/* Max Loss */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                Max Loss Per Trade (₹)
              </label>
              <input
                {...register('maxLoss', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={1000}
                max={100000}
                step={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                Stop loss at ₹{watchedValues.maxLoss?.toLocaleString()}
              </p>
              {errors.maxLoss && (
                <p className="text-red-500 text-sm mt-1">{errors.maxLoss.message}</p>
              )}
            </div>

            {/* Stop Loss Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stop Loss %
              </label>
              <input
                {...register('stopLossPercentage', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={100}
                max={500}
                step={25}
              />
              <p className="text-xs text-gray-500 mt-1">
                Exit at {watchedValues.stopLossPercentage}% of premium
              </p>
              {errors.stopLossPercentage && (
                <p className="text-red-500 text-sm mt-1">{errors.stopLossPercentage.message}</p>
              )}
            </div>

            {/* Execution Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Execution Day
              </label>
              <select
                {...register('executionDay')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday (Recommended)</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            {/* Execution Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Execution Time
              </label>
              <input
                {...register('executionTime')}
                type="time"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Market hours: 9:15 AM - 3:30 PM
              </p>
            </div>

            {/* Auto Start */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  {...register('autoStart')}
                  type="checkbox"
                  className="sr-only"
                />
                <div className="relative">
                  <div className={`block w-14 h-8 rounded-full ${watchedValues.autoStart ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${watchedValues.autoStart ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Auto Start Strategy
                </span>
              </label>
            </div>
          </div>

          {/* Strategy Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Strategy Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Sell CALL:</span>
                <div className="font-semibold">{(getATMStrike() + 100).toLocaleString()} CE</div>
                <div className="text-green-600">+₹{calculatePremium(100).toFixed(0)}</div>
              </div>
              <div>
                <span className="text-gray-600">Sell PUT:</span>
                <div className="font-semibold">{(getATMStrike() - 100).toLocaleString()} PE</div>
                <div className="text-green-600">+₹{calculatePremium(100).toFixed(0)}</div>
              </div>
              <div>
                <span className="text-gray-600">Net Premium:</span>
                <div className="font-semibold text-green-600">
                  +₹{(calculatePremium(100) * 2).toFixed(0)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Max Risk:</span>
                <div className="font-semibold text-red-600">
                  ₹{watchedValues.maxLoss?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={stopStrategy}
              disabled={!isActive}
              className="flex items-center px-6 py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Strategy
            </button>
            
            <button
              type="submit"
              disabled={isActive}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Strategy
            </button>
          </div>
        </form>

        {/* Current Execution */}
        {execution && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Execution</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">{execution.status}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Initial Price</div>
                <div className="text-lg font-bold text-gray-900">
                  ₹{execution.initialPrice?.toLocaleString()}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600">Current Price</div>
                <div className="text-lg font-bold text-gray-900">
                  ₹{sensexPrice?.toLocaleString()}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600">Positions</div>
                <div className="text-lg font-bold text-blue-600">
                  {execution.positionCount}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600">Current P&L</div>
                <div className={`text-lg font-bold ${execution.currentPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{execution.currentPnL?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}