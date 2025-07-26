import React from 'react'

function ResetPassword() {
  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Reset Password</h2>
        <p className="text-gray-500 mb-6 text-center">Enter your new password below.</p>
        <form className="space-y-4 mb-4">
          <input
            type="password"
            placeholder="New password"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Reset Password
          </button>
        </form>
        <div className="text-center">
          <a href="/login" className="text-orange-400 hover:underline font-semibold">Back to Login</a>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword 