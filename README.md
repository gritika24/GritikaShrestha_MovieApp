# Now Showing — React + Node.js Backend

This version adds a Node.js/Express backend to the original React + Vite movie app.

## What was added

- Node.js + Express REST API
- Persistent server-side JSON database at `server/data/db.json`
- Server-side signup/login
- Password hashing with `bcryptjs`
- JWT authentication
- Protected movie create/update/delete endpoints
- Per-user watchlist/favorites
- Frontend API helper using `fetch`
- Vite proxy from `/api` to `http://localhost:5000`

The frontend no longer stores accounts or password hashes in localStorage.

## Run the project

You need Node.js 18+.

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend

In the project folder:

```bash
npm run server
```

You should see:

```text
Now Showing API running at http://localhost:5000
```

Keep this terminal open.

### 3. Start the frontend

Open a second terminal:

```bash
npm run dev
```

Open the Vite address, normally `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Authentication |
|---|---|---|
| GET | `/api/health` | No |
| POST | `/api/auth/signup` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| GET | `/api/movies` | No |
| POST | `/api/movies` | Yes |
| PUT | `/api/movies/:id` | Yes |
| DELETE | `/api/movies/:id` | Yes |
| GET | `/api/favorites` | Yes |
| PUT | `/api/favorites/:movieId` | Yes |

## Project structure

```text
movie-app/
├── server/
│   ├── server.js
│   └── data/
│       └── db.json          # created automatically on first server start
├── src/
│   ├── components/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── data/
│   │   └── movies.js
│   ├── utils/
│   │   └── api.js
│   └── App.jsx
├── package.json
├── vite.config.js
└── README.md
```

## How authentication works

1. React sends signup/login details to the Node.js API.
2. The backend hashes new passwords with bcrypt.
3. On successful login, the backend returns a JWT.
4. The frontend stores the JWT locally.
5. `src/utils/api.js` automatically sends it as a Bearer token.
6. Express middleware verifies the token before protected operations.
7. The JWT expires after 2 hours.

### JWT secret

The default secret in `server/server.js` is only for local development. Before deploying, set `JWT_SECRET`.

Windows PowerShell:

```powershell
$env:JWT_SECRET="replace-with-a-long-random-secret"
npm run server
```

macOS/Linux:

```bash
JWT_SECRET="replace-with-a-long-random-secret" npm run server
```

For production, use HTTPS, a real database such as PostgreSQL/MySQL, a strong secret stored outside source control, stricter CORS, rate limiting, and additional input/security controls.

## Reset the database

Stop the backend and delete:

```text
server/data/db.json
```

The backend recreates it with the original 16 movies the next time it starts.


