import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOTP'
import ResetPassword from './pages/ResetPassword'
import Signup from './pages/Signup'
import HomePage from './pages/HomePage'
import LoadingPage from './pages/LoadingPage' // 👈 import it

import './App.css'
import Dashboard from './pages/dashboard'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Contact from './pages/contact'
import TermsAndConditions from './pages/tnc'
import PrivacyandPolicy from './pages/privacyAndPolicy'
import About from './pages/About'
import InvestorRelations from './pages/InvestorRelations'
import GiftVouchers from './components/giftVouchers'
import MenTShirts from './pages/productpage'
import ProductPage from './pages/product'
import GetNotified from './pages/GetNotified'

function RequireAuth({ children }) {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000) // simulate 2.5s load
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingPage /> // 👈 show loader

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyandPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/investor-relations" element={<InvestorRelations />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/products" element={<MenTShirts />} />
        <Route path="/get-notified" element={<GetNotified />} />
        <Route path="/wishlist" element={
          <RequireAuth>
            <Wishlist />
          </RequireAuth>
        } />
        <Route path="/dashboard" element={
          <RequireAuth>
            <div className='w-screen h-screen overflow-x-hidden'>
              <Dashboard />
            </div>
          </RequireAuth>
        } />
        <Route path="/gift-vouchers" element={<GiftVouchers />} />
      </Routes>
    </Router>
  )
}

export default App
