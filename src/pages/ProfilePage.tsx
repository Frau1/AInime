import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
  const load = async () => {
    const { data: userData, error: userError } =
      await supabase.auth.getUser()

    if (userError) {
      console.error(userError)
      return
    }

    const user = userData.user

    if (!user) return

    const { data, error } = await supabase
  .from('profiles')
  .select('username, email')
  .eq('id', user.id)
  .single()

    if (error) {
      console.error('PROFILE ERROR:', error)

      setProfile({
        username: 'Unknown User',
        email: user.email
      })

      return
    }

    setProfile({
  username: data.username,
  email: data.email
})
  }

  load()
}, [])

  return (
    <div
      className="page"
      style={{
        minHeight: '100vh',
        padding: '24px 16px'
      }}
    >
      <div
        style={{
          marginBottom: 32
        }}
      >
        <p
          style={{
            color: 'var(--neon-cyan)',
            letterSpacing: 2,
            fontSize: 13
          }}
        >
          USER PROFILE
        </p>

        <h1
          style={{
            color: '#fff',
            fontFamily: "'Orbitron', monospace",
            fontSize: 'clamp(28px, 4vw, 52px)'
          }}
        >
          Your Profile
        </h1>
      </div>
      {!profile && (
  <div className="card" style={{ padding: 24 }}>
    <p style={{ color: '#c4a8e8' }}>
      No profile information found.
    </p>
  </div>
)}

      {profile && (
        <div
          className="card"
          style={{
            padding: 24,
            borderRadius: 8,
            maxWidth: 500
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#9966cc', marginBottom: 6 }}>
              Username
            </p>

            <h2 style={{ color: '#fff' }}>
              {profile.username}
            </h2>
          </div>

          <div>
            <p style={{ color: '#9966cc', marginBottom: 6 }}>
              Email
            </p>

            <h2 style={{ color: '#fff' }}>
              {profile.email}
            </h2>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage