import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOTP'
import ResetPassword from './pages/ResetPassword'
import Signup from './pages/Signup'
import HomePage from './pages/HomePage'
import './App.css'
import Dashboard from './pages/dashboard'

function RequireAuth({ children }) {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={
          <RequireAuth>
            <div className='w-screen h-screen overflow-x-hidden'>
              <Dashboard />
            </div>
          </RequireAuth>
        } />
      </Routes>
    </Router>
  )
}

export default App
