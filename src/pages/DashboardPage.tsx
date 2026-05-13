import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      const { data: authData } =
        await supabase.auth.getUser()

      const user = authData.user

      if (!user) {
        navigate('/login')
        return
      }

      const { data, error } = await supabase
        .from('saved_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('FETCH ERROR:', error)
        return
      }

      setRecommendations(data || [])
    }

    fetchRecommendations()
  }, [navigate])

  return (
    <div
      className="page"
      style={{
        minHeight: '100vh',
        padding: '24px 16px'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 20
        }}
      >
        <div>
          <p
            style={{
              color: 'var(--neon-cyan)',
              letterSpacing: 2,
              fontSize: 13
            }}
          >
            AI DASHBOARD
          </p>

          <h1
            style={{
              color: '#fff',
              fontFamily: "'Orbitron', monospace",
              fontSize: 'clamp(28px, 4vw, 56px)'
            }}
          >
            Saved AI Recommendations
          </h1>
        </div>

        <button
          className="neon-btn"
          onClick={() => navigate('/')}
        >
          + New Recommendation
        </button>
      </div>

      {/* EMPTY STATE */}
      {recommendations.length === 0 ? (
        <div
          className="card"
          style={{
            padding: 24,
            textAlign: 'center'
          }}
        >
          <p style={{ color: '#c4a8e8' }}>
            No saved recommendations yet.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: 20
          }}
        >
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: 14,
                borderRadius: 8,
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start',
                flexWrap: 'wrap'
              }}
            >
              {/* IMAGE */}
              <img
                src={item.image_url}
                alt={item.title}
                style={{
                  width: 110,
                  height: 160,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '1px solid var(--neon-purple)',
                  boxShadow: '0 0 12px #9d4edd55'
                }}
              />

              {/* CONTENT */}
              <div
                style={{
                  flex: 1,
                  minWidth: 250
                }}
              >
                <p
                  style={{
                    color: 'var(--neon-cyan)',
                    fontSize: 12,
                    letterSpacing: 2,
                    marginBottom: 8
                  }}
                >
                  SAVED ANIME
                </p>

                <h2
                  style={{
                    color: '#fff',
                    marginBottom: 12,
                    fontFamily: "'Orbitron', monospace",
                    fontSize: 'clamp(18px, 2vw, 24px)'
                  }}
                >
                  {item.title}
                </h2>

                <p
  style={{
    color: '#b89ad8',
    lineHeight: 1.5,
    marginBottom: 14,
    fontSize: 13
  }}
>
  {item.synopsis}
</p>

                {/* BUTTONS */}
<div
  style={{
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap'
  }}
>
  <button
    className="neon-btn"
    style={{
      borderColor: '#ff4d6d',
      color: '#ff4d6d'
    }}
    onClick={async () => {
      await supabase
        .from('saved_recommendations')
        .delete()
        .eq('id', item.id)

      setRecommendations((prev) =>
        prev.filter((r) => r.id !== item.id)
      )
    }}
  >
    Delete
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage