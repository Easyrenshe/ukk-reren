import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'
import { FaHotel, FaLock, FaEnvelope } from 'react-icons/fa'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error: authError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email || !password) {
      setLocalError('Email dan password harus diisi')
      return
    }

    try {
      await login({ email, password })
      navigate('/')
    } catch {}
  }

  const displayError = localError || authError

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/22/e9/a0/22e9a0acff1c2e3b4514630d3820e9e8.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay gelap + blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-lg"
      >
        {/* ✅ CARD TRANSPARAN GLASS */}
        <div className="bg-white/25 border border-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 text-white">

          {/* Logo & Title */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 shadow-lg">
                <FaHotel className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-semibold tracking-widest uppercase">
              Management System
            </h1>
            <p className="text-sm text-gray-200 mt-2 tracking-wide">
              Smart Control for Modern Hotel Operations
            </p>
          </div>

          {/* Error */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-400/40 rounded-xl"
            >
              <p className="text-red-200 text-sm font-medium">
                ⚠️ {displayError}
              </p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {/* Hidden dummy inputs to discourage browser autofill (keeps visible inputs empty on refresh) */}
            <input
              type="text"
              name="prevent-autofill-username"
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
            />
            <input
              type="password"
              name="prevent-autofill-password"
              autoComplete="new-password"
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
            />

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-200">Email</label>
              <div className="relative mt-2">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" />
                <input
                  name="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hotel.com"
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-200">Password</label>
              <div className="relative mt-2">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" />
                <input
                  name="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Button */}
            <motion.button
              whileHover={!loading ? { scale: 1.03 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-2xl font-semibold tracking-widest uppercase transition-all duration-300 shadow-lg
              ${
                loading
                  ? 'bg-gray-400/50 cursor-not-allowed text-gray-300'
                  : 'bg-gradient-to-r from-pink-500 via-purple-600 to-fuchsia-700 text-white hover:shadow-xl hover:brightness-110'
              }`}
            >
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
