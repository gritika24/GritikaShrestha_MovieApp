import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";
const DB_FILE = path.join(__dirname, "data", "db.json");

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

const initialMovies = [
  { id: 1, title: "Nightfall Station", year: 2019, genre: "Sci-Fi", director: "R. Okafor", runtime: 118, rating: 8.4, synopsis: "A transit engineer trapped on a derelict orbital station must barter with its last three residents to find a way home before the reactor fails.", cast: ["Amara Voss", "Tobin Reyes", "Idris Cole"] },
  { id: 2, title: "The Long Quiet", year: 2016, genre: "Drama", director: "M. Delacroix", runtime: 132, rating: 8.7, synopsis: "Two estranged sisters spend one final summer closing their late father's bookshop, unearthing letters that rewrite everything they believed about him.", cast: ["Sable Marsh", "Odalys Kim"] },
  { id: 3, title: "Red Hour", year: 2021, genre: "Thriller", director: "J. Ashworth", runtime: 104, rating: 7.9, synopsis: "A night-shift dispatcher realizes the emergency calls she's routing are all coming from her own address, one hour in the future.", cast: ["Priya Nandan", "Cole Ferris"] },
  { id: 4, title: "Marmalade & Gravel", year: 2018, genre: "Comedy", director: "F. Bianchi", runtime: 96, rating: 7.2, synopsis: "A failed jam entrepreneur cons her way onto a small-town road crew to hide from her creditors, and accidentally becomes the town's favorite person.", cast: ["Dot Renner", "Marcus Ude"] },
  { id: 5, title: "Paper Lanterns", year: 2020, genre: "Animation", director: "H. Sato", runtime: 101, rating: 8.9, synopsis: "A folded-paper spirit guides a grieving child through a floating night market where memories are traded like currency.", cast: ["Voice: Lina Aoki", "Voice: Ben Whitfield"] },
  { id: 6, title: "Hollow Orchard", year: 2022, genre: "Horror", director: "K. Novak", runtime: 99, rating: 7.5, synopsis: "A family inherits an orchard where the trees only bear fruit the night after someone tells a lie.", cast: ["Greta Palladino", "Simeon Ash"] },
  { id: 7, title: "Iron Meridian", year: 2017, genre: "Action", director: "D. Osei", runtime: 128, rating: 8.1, synopsis: "A disgraced cartographer is hired to smuggle a map across a war-fractured border, one degree of longitude at a time.", cast: ["Rene Castellan", "Wren Okoye"] },
  { id: 8, title: "Tideline", year: 2015, genre: "Romance", director: "A. Marchetti", runtime: 109, rating: 7.8, synopsis: "Two lighthouse keepers on opposite shores of a strait fall for each other entirely through semaphore flags and weather reports.", cast: ["Nadia Solberg", "Theo Kwan"] },
  { id: 9, title: "Static Bloom", year: 2023, genre: "Sci-Fi", director: "R. Okafor", runtime: 121, rating: 8.3, synopsis: "A radio botanist discovers that a signal from deep space is, impossibly, a growing season.", cast: ["Idris Cole", "Marguerite Fen"] },
  { id: 10, title: "Concrete Choir", year: 2019, genre: "Drama", director: "L. Abara", runtime: 114, rating: 8.5, synopsis: "A retired steelworker forms a choir out of the demolition crew tearing down his old mill, one last song before the building falls.", cast: ["Odalys Kim", "Pieter Voss"] },
  { id: 11, title: "The Understudy Job", year: 2021, genre: "Thriller", director: "J. Ashworth", runtime: 107, rating: 7.6, synopsis: "A stand-in actress is asked to impersonate a missing heiress for one night, then finds she can't remember how to stop.", cast: ["Priya Nandan", "Elle Farrow"] },
  { id: 12, title: "Casserole Diplomacy", year: 2020, genre: "Comedy", director: "F. Bianchi", runtime: 92, rating: 7.0, synopsis: "Rival church potlucks accidentally trigger a neighborhood-wide peace treaty negotiated entirely through side dishes.", cast: ["Dot Renner", "Sanjay Oduya"] },
  { id: 13, title: "The Cartographer's Cat", year: 2018, genre: "Animation", director: "H. Sato", runtime: 88, rating: 8.2, synopsis: "A mapmaker's cat redraws the family atlas each night, sending the household on accidental detours through their own memories.", cast: ["Voice: Lina Aoki", "Voice: Rosa Iyer"] },
  { id: 14, title: "Thornfield", year: 2022, genre: "Horror", director: "K. Novak", runtime: 103, rating: 7.3, synopsis: "A land surveyor keeps finding the same abandoned farmhouse no matter which direction she walks from it.", cast: ["Greta Palladino", "Omar Delacroix"] },
  { id: 15, title: "Salt Convoy", year: 2016, genre: "Action", director: "D. Osei", runtime: 124, rating: 7.9, synopsis: "A retired convoy driver comes out of hiding to run one last route through a blockaded salt-mining territory.", cast: ["Rene Castellan", "Halima Nasser"] },
  { id: 16, title: "Letters to the Tide", year: 2023, genre: "Romance", director: "A. Marchetti", runtime: 112, rating: 8.0, synopsis: "A ferry operator finds a decades-old bundle of undelivered love letters and sets out to finish a stranger's romance.", cast: ["Nadia Solberg", "Julian Torres"] }
];

function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    const db = { users: [], movies: initialMovies, favorites: {} };
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return db;
  }
  const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  db.users ??= [];
  db.movies ??= initialMovies;
  db.favorites ??= {};
  return db;
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

let db = loadDb();

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: "2h" });
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authentication required." });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
}

function validateMovie(body) {
  const title = String(body.title ?? "").trim();
  const genre = String(body.genre ?? "").trim();
  const director = String(body.director ?? "Unknown").trim() || "Unknown";
  const synopsis = String(body.synopsis ?? "").trim();
  const year = Number(body.year);
  const runtime = Number(body.runtime);
  const rating = Number(body.rating);
  const cast = Array.isArray(body.cast)
    ? body.cast.map(String).map((x) => x.trim()).filter(Boolean)
    : String(body.cast ?? "").split(",").map((x) => x.trim()).filter(Boolean);

  if (!title || !genre || !synopsis) return { error: "Title, genre and synopsis are required." };
  if (!Number.isInteger(year) || year < 1888 || year > new Date().getFullYear() + 2) return { error: "Enter a valid year." };
  if (!Number.isFinite(runtime) || runtime <= 0) return { error: "Runtime must be greater than 0." };
  if (!Number.isFinite(rating) || rating < 0 || rating > 10) return { error: "Rating must be between 0 and 10." };

  return { movie: { title, year, genre, director, runtime, rating, synopsis, cast } };
}

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.post("/api/auth/signup", async (req, res) => {
  try {
    const username = String(req.body.username ?? "").trim();
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");

    if (!username || !email || password.length < 6) {
      return res.status(400).json({ message: "Username, valid email and a password of at least 6 characters are required." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
    if (db.users.some((u) => u.email === email)) return res.status(409).json({ message: "An account with that email already exists." });

    const user = {
      id: Date.now().toString(),
      username,
      email,
      passwordHash: await bcrypt.hash(password, 12)
    };
    db.users.push(user);
    db.favorites[user.id] = [];
    saveDb(db);

    const token = signToken(user);
    res.status(201).json({ token, user: { username, email } });
  } catch (error) {
    res.status(500).json({ message: "Could not create account." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");
  const user = db.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "No account found with that email." });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Incorrect password." });

  res.json({ token: signToken(user), user: { username: user.username, email: user.email } });
});

app.get("/api/auth/me", auth, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(401).json({ message: "User no longer exists." });
  res.json({ user: { username: user.username, email: user.email } });
});

app.get("/api/movies", (req, res) => res.json({ movies: db.movies }));

app.post("/api/movies", auth, (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) return res.status(400).json({ message: result.error });

  const id = db.movies.length ? Math.max(...db.movies.map((m) => m.id)) + 1 : 1;
  const movie = { id, ...result.movie };
  db.movies.push(movie);
  saveDb(db);
  res.status(201).json({ movie });
});

app.put("/api/movies/:id", auth, (req, res) => {
  const id = Number(req.params.id);
  const index = db.movies.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ message: "Movie not found." });

  const result = validateMovie(req.body);
  if (result.error) return res.status(400).json({ message: result.error });

  db.movies[index] = { id, ...result.movie };
  saveDb(db);
  res.json({ movie: db.movies[index] });
});

app.delete("/api/movies/:id", auth, (req, res) => {
  const id = Number(req.params.id);
  const exists = db.movies.some((m) => m.id === id);
  if (!exists) return res.status(404).json({ message: "Movie not found." });

  db.movies = db.movies.filter((m) => m.id !== id);
  for (const userId of Object.keys(db.favorites)) {
    db.favorites[userId] = db.favorites[userId].filter((movieId) => movieId !== id);
  }
  saveDb(db);
  res.json({ message: "Movie deleted." });
});

app.get("/api/favorites", auth, (req, res) => {
  res.json({ favorites: db.favorites[req.user.id] ?? [] });
});

app.put("/api/favorites/:movieId", auth, (req, res) => {
  const movieId = Number(req.params.movieId);
  if (!db.movies.some((m) => m.id === movieId)) return res.status(404).json({ message: "Movie not found." });

  const list = new Set(db.favorites[req.user.id] ?? []);
  if (req.body.favorite) list.add(movieId);
  else list.delete(movieId);

  db.favorites[req.user.id] = [...list];
  saveDb(db);
  res.json({ favorites: db.favorites[req.user.id] });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Now Showing API running at http://localhost:${PORT}`);
});
