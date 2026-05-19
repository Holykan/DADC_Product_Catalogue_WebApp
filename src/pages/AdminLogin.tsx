import { useState } from 'react'
import './AdminLogin.css'

const ADMIN_PASSWORD = 'dadc2026admin'

type Props = {
  onLogin: () => void
}

const AdminLogin = ({ onLogin }: Props) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError(true)
      setPassword('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/dadc_logo.webp" alt="DADC Logo" className="login-logo" />
        <h1 className="login-title">Admin Access</h1>
        <p className="login-subtitle">Enter your password to continue</p>

        <div className="login-form">
          <input
            type="password"
            className={error ? 'login-input error' : 'login-input'}
            placeholder="Enter password..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {error && (
            <p className="login-error">⚠️ Incorrect password. Try again.</p>
          )}
          <button className="login-btn" onClick={handleSubmit}>
            Enter Admin Panel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin