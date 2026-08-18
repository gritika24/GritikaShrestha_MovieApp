import React from "react";
import { Star, Pencil, Trash2 } from "lucide-react";
import { styles } from "../styles.js";
import { posterStyle } from "../data/movies.js";

export default function MovieCard({ movie, isFavorite, onToggleFavorite, onSelect, onEdit, onDelete, canEdit }) {
  return (
    <article style={styles.card} onClick={() => onSelect(movie)}>
      <div style={{ ...styles.poster, ...posterStyle(movie.id) }}>
        <div style={styles.sprocketsTop} aria-hidden="true" />

        {canEdit && (
          <div style={styles.cardIconRow}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(movie);
              }}
              style={styles.cardIconBtn}
              aria-label={`Edit ${movie.title}`}
            >
              <Pencil size={13} color="#F1E7D0" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(movie);
              }}
              style={styles.cardIconBtn}
              aria-label={`Delete ${movie.title}`}
            >
              <Trash2 size={13} color="#F1E7D0" />
            </button>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie.id);
          }}
          style={styles.starBtn}
          aria-label={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Star size={16} color="#C9A24B" fill={isFavorite ? "#C9A24B" : "none"} />
        </button>
        <span style={styles.posterInitial}>{movie.title.charAt(0)}</span>
        <div style={styles.sprocketsBottom} aria-hidden="true" />
      </div>
      <div style={styles.cardFooter}>
        <h3 style={styles.cardTitle}>{movie.title}</h3>
        <div style={styles.cardMeta}>
          <span>{movie.year}</span>
          <span style={styles.dot}>·</span>
          <span>{movie.genre}</span>
          <span style={styles.ratingBadge}>
            <Star size={11} color="#1C1210" fill="#1C1210" /> {movie.rating}
          </span>
        </div>
      </div>
    </article>
  );
}
