import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { animeService } from '../services/animeService';
import { supabase } from '../lib/supabase'

interface AnimeResult {
  mal_id: number;
  title: string;
  score: number;
  genres: { name: string }[];
  images: { jpg: { image_url: string } };
  episodes: number;
  year: number | null;
  synopsis: string;
}

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [loadingAI, setLoadingAI] = useState(true);
  const [aiSummary, setAiSummary] = useState('');

  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filter, setFilter] = useState('All');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
  const fetchAnime = async () => {
    try {
      setLoading(true);
      setError('');

      const searchTerm = query || 'top';

      let animeList: AnimeResult[] = [];

      // 🔥 if no query → show top anime
      if (searchTerm === 'top') {
        const data = await animeService.getTopAnime();
        animeList = data.slice(0, 12);
      } else {
        const data = await animeService.searchAnime(searchTerm);
        animeList = data.slice(0, 12);
      }

      setResults(animeList);

      // 🎯 extract genres
      const genresSet = new Set<string>();
      animeList.forEach((a) =>
        a.genres.forEach((g) => genresSet.add(g.name))
      );

      setAvailableGenres(['All', ...Array.from(genresSet).sort()]);

    } catch (err) {
      console.error(err);
      setError('Failed to load anime data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  fetchAnime();
}, [query]);

  useEffect(() => {
  setLoadingAI(true);
  const summary = query
    ? `Based on your interest in "${query}", I've curated a selection of highly rated series that match your taste profile. These recommendations emphasize strong storytelling, visual excellence, and thematic depth.`
    : `Here are some top-rated anime for you. These selections are known for their exceptional quality and broad appeal.`;

  let i = 0;
  const interval = setInterval(() => {
    setAiSummary(summary.slice(0, i));
    i += 2;
    if (i > summary.length) {
      clearInterval(interval);
      setLoadingAI(false);
    }
  }, 20);

  return () => clearInterval(interval);
}, [query]);

// ⭐ LOAD SAVED ANIME
useEffect(() => {
  const loadSaved = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data } = await supabase
      .from('saved_recommendations')
      .select('result')
      .eq('user_id', user.id);

    const map: Record<number, boolean> = {};

    data?.forEach((item) => {
      results.forEach((anime) => {
        if (item.result.includes(anime.title)) {
          map[anime.mal_id] = true;
        }
      });
    });

    setSavedMap(map);
  };

  if (results.length > 0) {
    loadSaved();
  }
}, [results]);

  const filteredResults =
    filter === 'All'
      ? results
      : results.filter((a) => a.genres.some((g) => g.name === filter));

  return (
    <div className="page" style={{ minHeight: '100vh', padding: '24px 16px', maxWidth: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', color: 'var(--neon-purple)', fontSize: 13, letterSpacing: 1 }}
          >
            ← Back
          </button>
          <div style={{ width: 1, height: 16, background: 'var(--neon-purple)44' }} />
          <span style={{ color: '#9966cc', fontSize: 13, letterSpacing: 1 }}>AI RESULTS</span>
        </div>
        <h1
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 'clamp(20px, 4vw, 32px)',
            color: '#e8d5ff',
          }}
        >
          Recommendations for:{' '}
          <span style={{ color: 'var(--neon-purple)' }}>"{query || 'Top Picks'}"</span>
        </h1>
      </div>

      {/* AI Summary Card */}
      <div
        className="card"
        style={{
          padding: '22px 26px',
          borderRadius: 4,
          marginBottom: 32,
          borderColor: 'var(--neon-cyan)44',
          background: 'var(--neon-cyan)06',
        }}
      >
        {/* ... AI summary content unchanged ... */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--neon-cyan)',
              boxShadow: '0 0 12px var(--neon-cyan)',
              animation: 'neonPulse 2s ease-in-out infinite',
            }}
          />
          <span style={{ color: 'var(--neon-cyan)', fontFamily: "'Orbitron', monospace", fontSize: 12, letterSpacing: 2 }}>
            AINIME AI ANALYSIS
          </span>
          {loadingAI && (
            <div
              style={{
                width: 16,
                height: 16,
                border: '2px solid var(--neon-cyan)44',
                borderTop: '2px solid var(--neon-cyan)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          )}
        </div>
        <p style={{ color: '#c4a8e8', fontSize: 16, lineHeight: 1.7 }}>
          {aiSummary}
          {loadingAI && <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--neon-cyan)' }}>█</span>}
        </p>
      </div>

      {/* Genre Filter Tabs */}
      {availableGenres.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          <select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  style={{
    padding: '10px',
    borderRadius: 4,
    background: '#0a0010',
    color: '#fff',
    border: '1px solid var(--neon-purple)'
  }}
>
  {availableGenres.map((g) => (
    <option key={g}>{g}</option>
  ))}
</select>
        </div>
      )}

      {/* Loading / Error / Anime Cards */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--neon-cyan)', fontSize: 18 }}>
          Searching for "{query || 'top anime'}"...
          <div
            style={{
              width: 24,
              height: 24,
              border: '2px solid var(--neon-cyan)44',
              borderTop: '2px solid var(--neon-cyan)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '16px auto',
            }}
          />
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--neon-pink)' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredResults.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6644aa', padding: '40px 0' }}>
              No anime found. Try a different search or filter.
            </div>
          ) : (
            filteredResults.map((anime) => (
              <div
  key={anime.mal_id}
  className="card result-card"
>
                <div className="result-card-img">
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 160 }}
                    onError={(e) => {(e.target as HTMLImageElement).src ='https://via.placeholder.com/300x400?text=No+Image';}}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, transparent 70%, var(--card-bg))',
                    }}
                  />
                </div>

               <div
  className="result-card-content"
  style={{
    padding: '14px',
  }}
>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      gap: 12,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 'clamp(16px, 2vw, 20px)',
                          fontWeight: 700,
                          color: '#e8d5ff',
                          marginBottom: 6,
                          fontFamily: "'Orbitron', monospace",
                        }}
                      >
                        {anime.title}
                      </p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {anime.genres.map((g) => (
                          <span key={g.name} className="tag tag-purple" style={{ fontSize: 11 }}>
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <StarRating rating={anime.score} />
                      <p style={{ fontSize: 12, color: '#6644aa', marginTop: 4 }}>
                        {anime.episodes || '?'} eps{anime.year ? ` · ${anime.year}` : ''}
                      </p>
                    </div>
                  </div>
<div
  style={{
    background: 'var(--neon-purple)0d',
    border: '1px solid var(--neon-purple)22',
    padding: '12px 16px',
    borderRadius: 2,
    marginTop: 12,
  }}
>
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'var(--neon-purple)',
        boxShadow: '0 0 8px var(--neon-purple)',
      }}
    />

    <span
      style={{
        color: 'var(--neon-purple)',
        fontSize: 11,
        letterSpacing: 2,
        fontWeight: 700,
      }}
    >
      WHY THIS MATCHES YOU
    </span>
  </div>
</div>

{/* SYNOPSIS */}
<p
  style={{
    color: '#b89ad8',
    fontSize: 12,
    lineHeight: 1.5,
    marginTop: 10,
  }}
>
  {anime.synopsis ||
    'A highly rated anime that matches your current taste profile.'}
</p>

                                    <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                    {/* SAVE TO SUPABASE */}
                    {(() => {
                      const isSaved = savedMap[anime.mal_id];

                      return (
                        <button
                          className={`neon-btn ${isSaved ? 'saved-btn' : ''}`}
                          onClick={async (e) => {
                            e.stopPropagation();

                            const { data } = await supabase.auth.getUser();
                            const user = data.user;

                            if (!user) {
                              alert('Please login first');
                              return;
                            }

                            if (isSaved) {
                              await supabase
                                .from('saved_recommendations')
                                .delete()
                                .eq('user_id', user.id)
                                .like('result', `%${anime.title}%`);

                              setSavedMap((prev) => ({
                                ...prev,
                                [anime.mal_id]: false,
                              }));

                              return;
                            }

                            await supabase.from('saved_recommendations').insert({
                              user_id: user.id,
                              prompt: query,
                              title: anime.title,
                              image_url: anime.images.jpg.image_url,
                              synopsis: anime.synopsis || '',
                              result: `${anime.title}\n\n${anime.synopsis || ''}`,
                            });

                            setSavedMap((prev) => ({
                              ...prev,
                              [anime.mal_id]: true,
                            }));
                          }}
                        >
                          {isSaved ? '✓ Saved' : 'Save'}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;