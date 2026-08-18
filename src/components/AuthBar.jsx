import React from "react";
import { LogIn, LogOut, UserCircle2 } from "lucide-react";
import { styles } from "../styles.js";

export default function AuthBar({ user, onLogout, onOpenAuth }) {
  return (
    <div style={styles.authBar}>
      {user ? (
        <>
          <span style={styles.authBadge}>
            <UserCircle2 size={15} />
            signed in as {user.username}
          </span>
          <button style={styles.authBarBtn} onClick={onLogout}>
            <LogOut size={13} />
            log out
          </button>
        </>
      ) : (
        <>
          <span style={styles.authBadgeMuted}>browsing as a guest — log in to add, edit, or remove features</span>
          <button style={styles.authBarBtn} onClick={() => onOpenAuth("login")}>
            <LogIn size={13} />
            log in / sign up
          </button>
        </>
      )}
    </div>
  );
}
