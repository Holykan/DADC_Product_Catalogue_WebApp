import { useState } from 'react'
import './AdminLogin.css'
import { supabase } from '../supabaseClient'
import { Eye, EyeOff } from 'lucide-react'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else if (data.session) {
        window.location.reload()
        return
      }
    } catch (err) {
      setError('Connection error — please try again')
    }

    setLoading(false)
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <img src="/dadc_logo.webp" alt="DADC" className="admin-login-logo" />
        <h1 className="admin-login-title">Admin Panel</h1>
        <p className="admin-login-subtitle">Sign in to manage your catalogue</p>

        <div className="admin-login-group">
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@dadc.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="admin-login-group">
          <label htmlFor="admin-password">Password</label>
          <div className="admin-login-password-wrap">
            <input
              id="admin-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="admin-login-eye"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && <p className="admin-login-error">⚠️ {error}</p>}

        <button
          type="submit"
          className="admin-login-btn"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin