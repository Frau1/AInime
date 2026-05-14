import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!password.trim()) return;

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert('Password updated successfully');
      navigate('/login');

    } catch (err) {
      console.error(err);
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
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 32
        }}
      >
        <h1
          style={{
            color: '#fff',
            marginBottom: 20,
            fontFamily: "'Orbitron', monospace"
          }}
        >
          Reset Password
        </h1>

        <input
          type="password"
          className="neon-input"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="neon-btn-solid"
          style={{ width: '100%', marginTop: 20 }}
          onClick={handleReset}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;