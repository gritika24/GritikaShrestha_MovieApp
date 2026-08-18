import React from "react";
import { styles } from "../styles.js";

export default function GenreChips({ genres, active, onSelect }) {
  return (
    <div style={styles.chipRow}>
      {genres.map((g) => (
        <button
          key={g}
          onClick={() => onSelect(g)}
          style={{ ...styles.chip, ...(active === g ? styles.chipActive : {}) }}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
