import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const validate = (value) => {
    if (!value) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationError = validate(email)
    setError(validationError)
    setTouched(true)
    if (!validationError) {
      // Here you would send the OTP, then navigate
      navigate('/verify-otp')
    }
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Forgot Password?</h2>
        <p className="text-gray-500 mb-6 text-center">Enter your email address to receive an OTP for password reset.</p>
        <form className="space-y-4 mb-4" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${error && touched ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-400`}
          />
          {error && touched && (
            <p className="text-red-500 text-xs mt-1 text-left">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Send OTP
          </button>
        </form>
        <div className="text-center">
          <a href="/login" className="text-orange-400 hover:underline font-semibold">Back to Login</a>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword 