import React from "react";
import { Film } from "lucide-react";
import { styles } from "../styles.js";
import MovieCard from "./MovieCard.jsx";

export default function MovieGrid({ movies, favorites, onToggleFavorite, onSelect, onEdit, onDelete, canEdit }) {
  if (movies.length === 0) {
    return (
      <div style={styles.empty}>
        <Film size={28} color="#8B7355" />
        <p style={{ fontFamily: "'Libre Baskerville', serif", color: "#C9BBA0", marginTop: 10 }}>
          Nothing playing that matches — try another title or genre, or add one.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {movies.map((m) => (
        <MovieCard
          key={m.id}
          movie={m}
          isFavorite={favorites.has(m.id)}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}
