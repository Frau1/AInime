import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { animeService } from '../services/animeService';
import { recommendationService } from '../services/recommendationService' 
import { supabase } from '../lib/supabase' 

interface AnimeItem {
  mal_id: number;
  title: string;
  score: number;
  genres: { name: string }[];
  images: { jpg: { image_url: string } };
  episodes: number;
}

const HomePage = () => {
  const [input, setInput] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [trending, setTrending] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const navigate = useNavigate();
  const placeholder = "e.g. I want a dark psychological thriller with complex characters...";

  useEffect(() => {
  const loadTrending = async () => {
    try {
      setLoading(true);

      const data = await animeService.getTopAnime();

      // limit to 12
      setTrending(data.slice(0, 12));

    } catch (err) {
      console.error(err);
      setError('Failed to load trending anime');
    } finally {
      setLoading(false);
    }
  };

  loadTrending();
}, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(placeholder.slice(0, i));
      i++;
      if (i > placeholder.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
  if (!input.trim()) return;

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    setAuthMessage('Please login first to continue.');
return;
  }

  navigate(`/results?q=${encodeURIComponent(input.trim())}`);
};

const handlePrompt = async () => {
  if (!promptInput.trim()) return;

  // ✅ Check if user is logged in FIRST
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    setAuthMessage('Please login first to continue.');
return;
  }

  try {
    setLoadingAI(true);

    // 🤖 Generate AI recommendation
    const result =
      await recommendationService.getRecommendations(promptInput);

    setAiResult(result || '');

    // 💾 Save recommendation to Supabase
    const { error } = await supabase
  .from('saved_recommendations')
  .insert([
    {
      user_id: user.id,
      prompt: promptInput,
      result
    }
  ])

if (error) {
  console.error(error)
  alert(error.message)
}

    // 🚀 Optional: navigate to results page
    navigate(`/results?q=${encodeURIComponent(promptInput)}`);

  } catch (err) {
    console.error(err);
    alert('Failed to generate recommendations');
  } finally {
    setLoadingAI(false);
  }
};

  return (
    <div className="page grid-bg" style={{ minHeight: "100vh", paddingBottom: 80 }}>
      {/* Hero – centered content, flexible width */}
      <div style={{ textAlign: "center", padding: "clamp(40px, 8vw, 80px) 0 clamp(30px, 5vw, 60px)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 50% 30%, var(--neon-purple)18, transparent)`, pointerEvents: "none" }} />
        <div style={{ fontSize: 13, letterSpacing: 6, color: "var(--neon-cyan)", textTransform: "uppercase", marginBottom: 20, fontWeight: 600 }}>
          ◈ Powered by Artificial Intelligence ◈
        </div>
        <h1 className="neon-title" style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900, lineHeight: 1, marginBottom: 16 }}>
          AI<span style={{ color: "var(--neon-cyan)", animation: "neonPulse 3s ease-in-out infinite", textShadow: `0 0 8px var(--neon-cyan), 0 0 20px var(--neon-cyan)` }}>nime</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 2.5vw, 22px)", color: "var(--text-muted)", maxWidth: 560, margin: "0 auto 48px", fontWeight: 300, lineHeight: 1.6 }}>
          Discover your next obsession. AI-powered anime recommendations tailored to your soul.
        </p>

        {/* Search Bar */}
<div
  style={{
    width: "100%",
    maxWidth: 1320,
    margin: "0 auto 16px",
    display: "flex",
    alignItems: "stretch",
    animation: "cyanPulse 3s ease-in-out infinite",
  }}
>
  <input
    className="neon-input"
    style={{
      flex: 1,
      padding: "16px 28px",
      borderRadius: "2px 0 0 2px",
      borderRight: "none",
    }}
    placeholder="Search anime titles..."
    value={input}
    onChange={(e) => {
  setInput(e.target.value);
  setAuthMessage('');
}}
    onKeyDown={(e) =>
      e.key === "Enter" && handleSearch()
    }
  />

  <button
    className="neon-btn-solid"
    style={{
      padding: "16px 32px",
      borderRadius: "0 2px 2px 0",
      whiteSpace: "nowrap",
      marginLeft: 0,
    }}
    onClick={handleSearch}
  >
    SEARCH
  </button>
</div>

{authMessage && (
  <div
    style={{
      width: "100%",
      maxWidth: 1320,
      margin: "0 auto 16px",
      padding: "14px 18px",
      border: "1px solid var(--neon-pink)",
      background: "rgba(255, 45, 120, 0.08)",
      color: "var(--neon-pink)",
      borderRadius: 4,
      fontWeight: 600,
      letterSpacing: 1,
      textAlign: "center",
      boxShadow: "0 0 12px rgba(255,45,120,0.25)"
    }}
  >
    {authMessage}
  </div>
)}

        {/* AI Prompt – centered */}
        <div className="card" style={{ width: "100%", padding: 28, borderRadius: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon-cyan)", boxShadow: `0 0 10px var(--neon-cyan)` }} />
            <span style={{ color: "var(--neon-cyan)", fontFamily: "'Orbitron', monospace", fontSize: 13, letterSpacing: 2 }}>AI RECOMMENDATION ENGINE</span>
          </div>
          <textarea
  className="neon-input"
  rows={3}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePrompt();
    }
  }}
            style={{ resize: "none", borderRadius: 2, marginBottom: 14 }}
            placeholder={typedText + (typedText.length < placeholder.length ? "█" : "")}
            value={promptInput}
            onChange={(e) => {
  setPromptInput(e.target.value);
  setAuthMessage('');
}}
          /> 
          <button
  className="neon-btn"
  style={{ width: "100%", marginTop: 12 }}
  onClick={handlePrompt}
>
  ◈ Ask AI for Recommendations ◈
</button>
          {loadingAI && (
  <p style={{ color: 'var(--neon-cyan)', marginTop: 10 }}>
    Generating AI recommendations...
  </p>
)}

{aiResult && (
  <div
    style={{
      marginTop: 16,
      padding: 16,
      border: '1px solid var(--neon-cyan)44',
      borderRadius: 4,
      background: 'var(--neon-cyan)06',
      color: '#c4a8e8',
      lineHeight: 1.6
    }}
  >
    {aiResult}
  </div>
)}
        </div>
      </div>

      {/* Trending Section – FULL WIDTH, responsive padding */}
      <div style={{ width: "100%", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 4, height: 32, background: `linear-gradient(var(--neon-purple), var(--neon-cyan))` }} />
          <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(18px, 3vw, 24px)", color: "var(--text-primary)", letterSpacing: 2 }}>
            TRENDING NOW
          </h2>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, var(--neon-purple)44, transparent)` }} />
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--neon-cyan)", fontSize: 18 }}>
            Loading trending anime...
            <div style={{ width: 24, height: 24, border: `2px solid var(--neon-cyan)44`, borderTop: `2px solid var(--neon-cyan)`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "16px auto" }} />
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--neon-pink)" }}>{error}</div>
        )}

        {!loading && !error && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(180px, 22vw, 240px), 1fr))",
            gap: "clamp(12px, 2vw, 20px)"
          }}>
            {trending.map((anime, i) => (
              <div
                key={anime.mal_id}
                className="card"
                style={{ borderRadius: 4, overflow: "hidden", cursor: "pointer", animationDelay: `${i * 60}ms` }}
                onClick={async () => {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    setAuthMessage('Please login first to continue.');
    return;
  }

  navigate(`/results?q=${encodeURIComponent(anime.title)}`);
}}
              >
                <div style={{ position: "relative", paddingTop: "140%", overflow: "hidden" }}>
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                    onMouseEnter={e => (e.target as HTMLImageElement).style.transform = "scale(1.06)"}
                    onMouseLeave={e => (e.target as HTMLImageElement).style.transform = "scale(1)"}
                    onError={(e) => {(e.target as HTMLImageElement).src ='https://via.placeholder.com/300x400?text=No+Image';}}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a001088 0%, transparent 50%)" }} />
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <span className="tag tag-purple" style={{ fontSize: 11 }}>#{i + 1}</span>
                  </div>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
                    {anime.title.length > 40 ? anime.title.slice(0, 40) + '...' : anime.title}
                  </p>
                  <StarRating rating={anime.score} />
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {anime.genres.slice(0, 2).map(g => (
                      <span key={g.name} className="tag tag-cyan" style={{ fontSize: 10 }}>{g.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
    </div>
  );
};

export default HomePage;