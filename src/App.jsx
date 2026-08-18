import React, { useEffect, useMemo, useState } from "react";
import { MOVIES as INITIAL_MOVIES } from "./data/movies.js";
import { styles } from "./styles.js";
import { useAuth } from "./context/AuthContext.jsx";
import { apiRequest } from "./utils/api.js";
import Marquee from "./components/Marquee.jsx";
import AuthBar from "./components/AuthBar.jsx";
import AuthModal from "./components/AuthModal.jsx";
import Controls from "./components/Controls.jsx";
import GenreChips from "./components/GenreChips.jsx";
import MovieGrid from "./components/MovieGrid.jsx";
import TicketModal from "./components/TicketModal.jsx";
import MovieForm from "./components/MovieForm.jsx";

export default function App() {
  const { user, ready, logout } = useAuth();

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [movieFormMode, setMovieFormMode] = useState(null);
  const [movieFormTarget, setMovieFormTarget] = useState(null);
  const [authModalMode, setAuthModalMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/movies");
      setMovies(data.movies);
      setError("");
    } catch (err) {
      setError("Could not connect to the backend. Start the server with npm run server.");
      // Keep the original data visible if the API is temporarily unavailable.
      setMovies(INITIAL_MOVIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready) loadMovies();
  }, [ready]);

  useEffect(() => {
    if (!ready || !user) {
      setFavorites(new Set());
      return;
    }
    apiRequest("/api/favorites")
      .then(({ favorites }) => setFavorites(new Set(favorites)))
      .catch(() => setFavorites(new Set()));
  }, [ready, user]);

  const genres = useMemo(
    () => ["All", ...Array.from(new Set(movies.map((m) => m.genre)))],
    [movies]
  );

  const toggleFavorite = async (id) => {
    const nextValue = !favorites.has(id);
    setFavorites((prev) => {
      const next = new Set(prev);
      nextValue ? next.add(id) : next.delete(id);
      return next;
    });

    if (user) {
      try {
        const { favorites: saved } = await apiRequest(`/api/favorites/${id}`, {
          method: "PUT",
          body: JSON.stringify({ favorite: nextValue }),
        });
        setFavorites(new Set(saved));
      } catch {
        setFavorites((prev) => {
          const next = new Set(prev);
          nextValue ? next.delete(id) : next.add(id);
          return next;
        });
      }
    }
  };

  const requireAuth = () => {
    if (!user) {
      setAuthModalMode("login");
      return false;
    }
    return true;
  };

  const openAddForm = () => {
    if (!requireAuth()) return;
    setMovieFormTarget(null);
    setMovieFormMode("add");
  };

  const openEditForm = (movie) => {
    if (!requireAuth()) return;
    setMovieFormTarget(movie);
    setMovieFormMode("edit");
    setSelected(null);
  };

  const handleDelete = async (movie) => {
    if (!requireAuth()) return;
    if (!window.confirm(`Remove "${movie.title}" from the programme?`)) return;

    try {
      await apiRequest(`/api/movies/${movie.id}`, { method: "DELETE" });
      setMovies((prev) => prev.filter((m) => m.id !== movie.id));
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(movie.id);
        return next;
      });
      if (selected?.id === movie.id) setSelected(null);
    } catch (err) {
      window.alert(err.message);
    }
  };

  const handleMovieFormSubmit = async (data) => {
    try {
      if (movieFormMode === "edit" && data.id) {
        const { movie } = await apiRequest(`/api/movies/${data.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        setMovies((prev) => prev.map((m) => (m.id === movie.id ? movie : m)));
        setSelected((prev) => (prev && prev.id === movie.id ? movie : prev));
      } else {
        const { movie } = await apiRequest("/api/movies", {
          method: "POST",
          body: JSON.stringify(data),
        });
        setMovies((prev) => [movie, ...prev]);
      }
      setMovieFormMode(null);
      setMovieFormTarget(null);
      setError("");
    } catch (err) {
      window.alert(err.message);
    }
  };

  const filtered = useMemo(() => {
    const list = movies.filter((m) => {
      const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = genre === "All" || m.genre === genre;
      const matchesFav = !showFavoritesOnly || favorites.has(m.id);
      return matchesQuery && matchesGenre && matchesFav;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "year") return b.year - a.year;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [movies, query, genre, sortBy, showFavoritesOnly, favorites]);

  if (!ready) return null;

  return (
    <div style={styles.page}>
      <Marquee />
      <AuthBar user={user} onLogout={logout} onOpenAuth={setAuthModalMode} />

      {error && (
        <div style={{ margin: "12px auto", maxWidth: 1200, padding: "10px 14px", border: "1px solid #6b4c45", color: "#e8c8bd", borderRadius: 8 }}>
          {error}
        </div>
      )}

      <Controls
        query={query}
        setQuery={setQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        favoritesCount={favorites.size}
        onAddMovie={openAddForm}
      />

      <GenreChips genres={genres} active={genre} onSelect={setGenre} />

      {loading ? (
        <p style={{ textAlign: "center", color: "#C9BBA0", padding: 40 }}>Loading programme…</p>
      ) : (
        <MovieGrid
          movies={filtered}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onSelect={setSelected}
          onEdit={openEditForm}
          onDelete={handleDelete}
          canEdit={Boolean(user)}
        />
      )}

      {selected && (
        <TicketModal
          movie={selected}
          isFavorite={favorites.has(selected.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelected(null)}
          onEdit={openEditForm}
          onDelete={handleDelete}
          canEdit={Boolean(user)}
        />
      )}

      {movieFormMode && (
        <MovieForm
          movie={movieFormTarget}
          onSubmit={handleMovieFormSubmit}
          onCancel={() => {
            setMovieFormMode(null);
            setMovieFormTarget(null);
          }}
        />
      )}

      {authModalMode && (
        <AuthModal initialMode={authModalMode} onClose={() => setAuthModalMode(null)} />
      )}
    </div>
  );
}
