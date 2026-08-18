import React from "react";
import { Clapperboard } from "lucide-react";
import { styles } from "../styles.js";

export default function Marquee() {
  return (
    <header style={styles.marquee}>
      <div style={styles.marqueeBulbs} aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} style={{ ...styles.bulb, animationDelay: `${(i % 7) * 0.15}s` }} />
        ))}
      </div>
      <div style={styles.marqueeInner}>
        <Clapperboard size={26} color="#C9A24B" style={{ flexShrink: 0 }} />
        <h1 style={styles.marqueeTitle}>NOW SHOWING</h1>
        <Clapperboard size={26} color="#C9A24B" style={{ flexShrink: 0, transform: "scaleX(-1)" }} />
      </div>
      <p style={styles.marqueeSub}>a small screening room of sixteen features</p>
    </header>
  );
}
