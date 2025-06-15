import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { UpstoxCallback } from './pages/UpstoxCallback'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/upstox/callback" element={<UpstoxCallback />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App