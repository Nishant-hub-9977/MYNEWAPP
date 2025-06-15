import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { upstoxService } from '../services/upstox'
import { useUpstoxStore } from '../stores/upstoxStore'
import { TrendingUp, CheckCircle, XCircle, Loader } from 'lucide-react'

export function UpstoxCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [message, setMessage] = useState('Processing authorization...')
  const { setAccessToken, setConnectionStatus } = useUpstoxStore()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          setStatus('error')
          setMessage(`Authorization failed: ${error}`)
          return
        }

        if (!code) {
          setStatus('error')
          setMessage('No authorization code received')
          return
        }

        setMessage('Exchanging authorization code for access token...')

        // Exchange code for access token
        const tokenData = await upstoxService.exchangeCode(code)

        if (tokenData.success && tokenData.token_data) {
          setAccessToken(tokenData.token_data.access_token)
          setConnectionStatus(true)
          setStatus('success')
          setMessage('Successfully connected to Upstox!')

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/')
          }, 2000)
        } else {
          throw new Error('Invalid token response')
        }

      } catch (error) {
        console.error('Upstox callback error:', error)
        setStatus('error')
        setMessage('Failed to connect to Upstox. Please try again.')
        setConnectionStatus(false)
      }
    }

    handleCallback()
  }, [searchParams, navigate, setAccessToken, setConnectionStatus])

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader className="h-12 w-12 text-blue-600 animate-spin" />
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />
      case 'error':
        return <XCircle className="h-12 w-12 text-red-600" />
      default:
        return <Loader className="h-12 w-12 text-blue-600 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="bg-white p-3 rounded-xl">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">AlgoTrader</h1>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              {getStatusIcon()}
            </div>
            
            <h2 className={`text-xl font-bold mb-4 ${getStatusColor()}`}>
              {status === 'processing' && 'Connecting to Upstox'}
              {status === 'success' && 'Connection Successful!'}
              {status === 'error' && 'Connection Failed'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {message}
            </p>

            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-sm">
                  You will be redirected to the dashboard shortly...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    Please check your Upstox app configuration and try again.
                  </p>
                </div>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-blue-200 text-sm">
            Secure OAuth integration with Upstox
          </p>
        </div>
      </div>
    </div>
  )
}