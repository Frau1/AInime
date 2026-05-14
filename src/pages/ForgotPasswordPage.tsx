import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError('');

      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        setError(error.message);
        return;
      }

      setSubmitted(true);

    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page grid-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, var(--neon-cyan)10, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 460,
          padding: '40px 32px',
          borderRadius: 8,
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            className="nav-logo"
            style={{
              fontSize: 32,
              display: 'inline-block',
              marginBottom: 10,
            }}
          >
            AI
            <span
              style={{
                color: 'var(--neon-cyan)',
                WebkitTextFillColor: 'var(--neon-cyan)',
              }}
            >
              nime
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 'clamp(24px, 4vw, 32px)',
              color: '#e8d5ff',
              marginBottom: 10,
            }}
          >
            Forgot Password
          </h1>

          <p
            style={{
              color: '#9966cc',
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Enter your email and we'll send a password reset link.
          </p>
        </div>

        {!submitted ? (
          <>
            {/* Email Input */}
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  fontSize: 12,
                  color: 'var(--neon-cyan)',
                  letterSpacing: 2,
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                EMAIL ADDRESS
              </label>

              <input
                className="neon-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleSubmit()
                }
              />
            </div>

            {/* Error */}
            {error && (
              <p
                style={{
                  color: '#ff4d6d',
                  marginBottom: 16,
                  fontSize: 14,
                }}
              >
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              className="neon-btn-solid"
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '14px 0',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              {loading && (
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: '2px solid #ffffff44',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              )}

              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '10px 0',
            }}
          >
            <div
              style={{
                fontSize: 54,
                marginBottom: 12,
              }}
            >
              ✦
            </div>

            <p
              style={{
                color: 'var(--neon-cyan)',
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Reset Link Sent
            </p>

            <p
              style={{
                color: '#b89ad8',
                lineHeight: 1.7,
                fontSize: 14,
              }}
            >
              Check your inbox for password reset instructions.
            </p>
          </div>
        )}

        {/* Back to Login */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
          }}
        >
          <Link
            to="/login"
            style={{
              color: 'var(--neon-purple)',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;