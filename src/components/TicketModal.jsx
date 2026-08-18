import React from "react";
import { X, Ticket, Star, Pencil, Trash2 } from "lucide-react";
import { styles } from "../styles.js";

function DetailRow({ label, value }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailDots} aria-hidden="true" />
      <span style={styles.detailValue}>{value}</span>
    </div>
  );
}

export default function TicketModal({ movie, isFavorite, onToggleFavorite, onClose, onEdit, onDelete, canEdit }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.ticket} onClick={(e) => e.stopPropagation()}>
        <div style={styles.ticketMain}>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} color="#C9BBA0" />
          </button>
          <p style={styles.ticketEyebrow}>ADMIT ONE · SCREENING ROOM</p>
          <h2 style={styles.ticketTitle}>{movie.title}</h2>
          <p style={styles.ticketSynopsis}>{movie.synopsis}</p>

          <div style={styles.detailGrid}>
            <DetailRow label="Director" value={movie.director} />
            <DetailRow label="Year" value={movie.year} />
            <DetailRow label="Runtime" value={`${movie.runtime} min`} />
            <DetailRow label="Genre" value={movie.genre} />
            <DetailRow label="Cast" value={movie.cast.join(", ")} />
          </div>
        </div>

        <div style={styles.perforation} aria-hidden="true" />

        <div style={styles.ticketStub}>
          <Ticket size={20} color="#C9A24B" />
          <p style={styles.stubLabel}>RATING</p>
          <p style={styles.stubRating}>{movie.rating}</p>
          <p style={styles.stubLabel}>SEAT</p>
          <p style={styles.stubSeat}>
            {String.fromCharCode(65 + (movie.id % 6))}
            {((movie.id * 7) % 20) + 1}
          </p>
          <button
            onClick={() => onToggleFavorite(movie.id)}
            style={{ ...styles.stubBtn, ...(isFavorite ? styles.stubBtnActive : {}) }}
          >
            <Star size={13} fill={isFavorite ? "#1C1210" : "none"} />
            {isFavorite ? "on watchlist" : "add to watchlist"}
          </button>

          {canEdit && (
            <div style={styles.stubIconRow}>
              <button style={styles.stubIconBtn} onClick={() => onEdit(movie)} aria-label={`Edit ${movie.title}`}>
                <Pencil size={13} />
              </button>
              <button style={styles.stubIconBtn} onClick={() => onDelete(movie)} aria-label={`Delete ${movie.title}`}>
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
