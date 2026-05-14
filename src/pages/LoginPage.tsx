import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService'

const LoginPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handle = async () => {

    if (!email || !password) {
    setMsg('Please fill in all fields.')
    return
  }

  if (isRegister && !username) {
    setMsg('Username is required.')
    return
  }

  setLoading(true)
  setMsg('')

  try {

    if (isRegister) {

      const { error } =
        await authService.signUp(
  email,
  password,
  username
)

      if (error) {
        setMsg(error.message)
      } else {
        setMsg(
          'Account created successfully!'
        )

        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }

    } else {

      const { error } =
        await authService.signIn(
          email,
          password
        )

      if (error) {
        setMsg(error.message)
      } else {

        setMsg('Login successful!')

        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    }

  } catch (err) {

    setMsg('Something went wrong.')

  } finally {

    setLoading(false)
  }
}

  return (
    <div className="page grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, var(--neon-purple)10, transparent)', pointerEvents: 'none' }} />
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: '40px 36px', borderRadius: 6, position: 'relative' }}>
        {/* Glow corners */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((c) => (
          <div
            key={c}
            style={{
              position: 'absolute',
              width: 20,
              height: 20,
              ...(c.includes('top') ? { top: -1 } : { bottom: -1 }),
              ...(c.includes('left') ? { left: -1 } : { right: -1 }),
              borderTop: c.includes('top') ? '2px solid var(--neon-cyan)' : 'none',
              borderBottom: c.includes('bottom') ? '2px solid var(--neon-cyan)' : 'none',
              borderLeft: c.includes('left') ? '2px solid var(--neon-cyan)' : 'none',
              borderRight: c.includes('right') ? '2px solid var(--neon-cyan)' : 'none',
            }}
          />
        ))}

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="nav-logo" style={{ fontSize: 28, display: 'inline-block', marginBottom: 8 }}>
            AI<span style={{ color: 'var(--neon-cyan)', WebkitTextFillColor: 'var(--neon-cyan)' }}>nime</span>
          </div>
          <p style={{ color: '#9966cc', fontSize: 14, letterSpacing: 1 }}>{isRegister ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</p>
        </div>

        <div style={{ display: 'flex', marginBottom: 28, border: '1px solid var(--neon-purple)33', borderRadius: 2 }}>
          {['Login', 'Register'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setIsRegister(t === 'Register');
                setMsg('');
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                fontFamily: "'Orbitron', monospace",
                background: (isRegister ? t === 'Register' : t === 'Login') ? 'var(--neon-purple)33' : 'transparent',
                color: (isRegister ? t === 'Register' : t === 'Login') ? 'var(--neon-purple)' : '#6644aa',
                borderBottom: (isRegister ? t === 'Register' : t === 'Login') ? '2px solid var(--neon-purple)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: 12, color: 'var(--neon-cyan)', letterSpacing: 2, display: 'block', marginBottom: 6 }}>USERNAME</label>
              <input className="neon-input" placeholder="your_username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, color: 'var(--neon-cyan)', letterSpacing: 2, display: 'block', marginBottom: 6 }}>EMAIL</label>
            <input className="neon-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--neon-cyan)', letterSpacing: 2, display: 'block', marginBottom: 6 }}>PASSWORD</label>
            <input
              className="neon-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handle()}
            />
          </div>
        </div>

        {msg && <div style={{ textAlign: 'center', color: 'var(--neon-cyan)', fontSize: 14, marginBottom: 16, fontWeight: 600 }}>{msg}</div>}

        <button
          className="neon-btn-solid"
          style={{ width: '100%', padding: '14px 0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          onClick={handle}
        >
          {loading && (
            <div
              style={{
                width: 20,
                height: 20,
                border: '2px solid #fff4',
                borderTop: '2px solid #fff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          )}
          {isRegister ? 'CREATE ACCOUNT' : 'LOGIN'}
        </button>

        {!isRegister && (
          <p
  style={{
    textAlign: 'center',
    marginTop: 16,
    fontSize: 13,
    color: '#6644aa',
  }}
>
  <a
    href="/forgot-password"
    style={{
      color: 'var(--neon-purple)',
      cursor: 'pointer',
      fontWeight: 700,
    }}
  >
    Forgot password?
  </a>
</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;