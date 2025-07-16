import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Campaigns from './components/Campaigns'
import TikTokAccounts from './components/TikTokAccounts'
import Effects from './components/Effects'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { ThemeProvider } from './components/theme-provider'
import { Card, CardContent } from '@/components/ui/card'

// Import komponen settings yang sudah ada
import GeneralSettings from './components/settings/GeneralSettings'
import CountriesSettings from './components/settings/CountriesSettings'
import DestinationsSettings from './components/settings/DestinationsSettings'
import HackTargetSettings from './components/settings/HackTargetSettings'
import BlockRulesSettings from './components/settings/BlockRulesSettings'
import AdsSourceSettings from './components/settings/AdsSourceSettings'
import LockPhoneSettings from './components/settings/LockPhoneSettings'

import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      try {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
    toast({
      title: "Login berhasil",
      description: `Selamat datang, ${userData.username}!`,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari sistem",
    })
  }

  return (
    <ThemeProvider defaultTheme="light">
      <Router>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : !isAuthenticated ? (
          <>
            <Login onLogin={handleLogin} />
          </>
        ) : (
          <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header user={user} onLogout={handleLogout} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/accounts" element={<TikTokAccounts />} />
                  <Route path="/effects" element={<Effects />} />

                  {/* Settings Routes - Langsung pakai komponen aslinya */}
                  <Route
                    path="/settings/general"
                    element={<GeneralSettings />}
                  />
                  <Route
                    path="/settings/lock-phone"
                    element={<LockPhoneSettings />}
                  />
                  <Route
                    path="/settings/ads-source"
                    element={<AdsSourceSettings />}
                  />
                  <Route
                    path="/settings/block-rules"
                    element={<BlockRulesSettings />}
                  />
                  <Route
                    path="/settings/hack-target"
                    element={<HackTargetSettings />}
                  />
                  <Route
                    path="/settings/countries"
                    element={<CountriesSettings />}
                  />
                  <Route
                    path="/settings/destinations"
                    element={<DestinationsSettings />}
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        )}
        <Toaster />
      </Router>
    </ThemeProvider>
  )
}

export default App
