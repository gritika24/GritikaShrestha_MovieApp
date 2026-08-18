import React from "react";
import { Search, Star, Plus } from "lucide-react";
import { styles } from "../styles.js";

export default function Controls({
  query,
  setQuery,
  sortBy,
  setSortBy,
  showFavoritesOnly,
  setShowFavoritesOnly,
  favoritesCount,
  onAddMovie,
}) {
  return (
    <div style={styles.controls}>
      <div style={styles.searchWrap}>
        <Search size={16} color="#8B7355" style={{ position: "absolute", left: 12, top: 11 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the programme…"
          style={styles.searchInput}
        />
      </div>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
        <option value="rating">Sort: rating</option>
        <option value="year">Sort: newest</option>
        <option value="title">Sort: title A–Z</option>
      </select>

      <button
        onClick={() => setShowFavoritesOnly((v) => !v)}
        style={{ ...styles.favToggle, ...(showFavoritesOnly ? styles.favToggleActive : {}) }}
      >
        <Star size={14} fill={showFavoritesOnly ? "#1C1210" : "none"} />
        watchlist ({favoritesCount})
      </button>

      <button onClick={onAddMovie} style={styles.addBtn}>
        <Plus size={14} />
        add feature
      </button>
    </div>
  );
}