import React from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useMarketStore } from '../../stores/marketStore'
import { TrendingUp, User, LogOut, Settings, Bell } from 'lucide-react'

export function Header() {
  const { user, profile, signOut } = useAuthStore()
  const { isConnected } = useMarketStore()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AlgoTrader</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-blue-600 font-medium">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Strategies</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Analytics</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Reports</a>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">
                  {profile?.first_name || user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-gray-500">
                  {profile?.subscription_tier || 'Free'} Plan
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="bg-gray-200 p-2 rounded-full">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}