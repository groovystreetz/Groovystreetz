import React, { useRef, useState } from 'react'

function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputsRef = useRef([])

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (!value) return
    const newOtp = [...otp]
    newOtp[idx] = value
    setOtp(newOtp)
    // Move to next input
    if (idx < 5 && value) {
      inputsRef.current[idx + 1].focus()
    }
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (otp[idx]) {
        const newOtp = [...otp]
        newOtp[idx] = ''
        setOtp(newOtp)
      } else if (idx > 0) {
        inputsRef.current[idx - 1].focus()
      }
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6).split('')
    if (paste.length) {
      const newOtp = [...otp]
      for (let i = 0; i < 6; i++) {
        newOtp[i] = paste[i] || ''
      }
      setOtp(newOtp)
      // Focus last filled
      const lastIdx = paste.length - 1
      if (inputsRef.current[lastIdx]) {
        inputsRef.current[lastIdx].focus()
      }
    }
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Verify OTP</h2>
        <p className="text-gray-500 mb-6 text-center">Enter the 6-digit OTP sent to your email address.</p>
        <form className="space-y-4 mb-4">
          <div className="flex justify-between space-x-2 mb-4" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputsRef.current[idx] = el}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className="w-12 h-12 text-center text-xl border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                autoFocus={idx === 0}
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Verify OTP
          </button>
        </form>
        <div className="flex justify-between text-sm">
          <a href="#" className="text-orange-400 hover:underline font-semibold">Resend OTP</a>
          <a href="/login" className="text-gray-500 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP 