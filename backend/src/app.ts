import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import path from "path";
import { promises as fs } from "fs";
import { config } from "./config";

dotenv.config();

const app = express();

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const JWT_SECRET = config.jwtSecret;

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
};

type Movie = {
  id: string;
  title: string;
  genre: string;
  rating: number;
  votes: string;
  img?: string;
  promoted?: boolean;
  languages?: string;
  age?: string;
  description?: string;
  duration?: string;
  director?: string;
  cast?: string;
  country?: string;
  releaseYear?: string;
  nowShowing?: boolean;
};

type Theater = {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  logo: string;
  distance?: string;
  cancellation?: string;
  showtimes?: Array<{
    id: string;
    movieId: string;
    date: string;
    startTime: string;
    format: string;
    audioType: string;
    price: number;
  }>;
};

type Booking = {
  id: string;
  userId: string;
  movieId: string;
  title: string;
  poster: string;
  cinema: string;
  date: string;
  time: string;
  datetime: string;
  seats: string[];
  quantity: number;
  total: number;
  ticket: number;
  fee: number;
  format: string;
  paymentMethod: string;
  createdAt: string;
};

type DbState = {
  users: User[];
  movies: Movie[];
  theaters: Theater[];
  bookings: Booking[];
};

const sampleMovies: Movie[] = [
  {
    id: "movie-1",
    title: "Black Panther",
    genre: "Action/Adventure/Sci-Fi",
    rating: 8.7,
    votes: "612K",
    img: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=600&q=80",
    languages: "English",
    age: "UA13+",
    description: "T'Challa returns home to claim his throne, but a vengeful challenger threatens to tear Wakanda apart.",
    duration: "2h 14m",
    nowShowing: true,
  },
  {
    id: "movie-2",
    title: "The Sheep Detectives",
    genre: "Comedy/Family/Mystery",
    rating: 7.3,
    votes: "8.4K",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    languages: "English",
    age: "U",
    description: "A flock of unusually sharp-eyed sheep turn amateur sleuths to crack a mystery on their farm.",
    duration: "1h 32m",
    nowShowing: true,
  },
  {
    id: "movie-3",
    title: "Bhoot Bangla",
    genre: "Horror/Comedy",
    rating: 6.8,
    votes: "14.2K",
    img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80",
    languages: "Hindi",
    age: "UA13+",
    description: "A haunted mansion and one overconfident ghost-hunter collide in a spooky, funny misadventure.",
    duration: "2h 10m",
    nowShowing: true,
  },
];

const sampleTheaters: Theater[] = [
  {
    id: "theater-1",
    name: "INOX Quest Mall",
    location: "Hazratganj, Lucknow",
    city: "Lucknow",
    state: "Uttar Pradesh",
    logo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=200&q=80",
    distance: "2.0 km",
    cancellation: "Allows cancellation",
    showtimes: [
      { id: "show-1", movieId: "movie-1", date: "2026-07-12", startTime: "10:15 AM", format: "2D", audioType: "Dolby 5.1", price: 220 },
      { id: "show-2", movieId: "movie-2", date: "2026-07-12", startTime: "6:45 PM", format: "2D", audioType: "Dolby Atmos", price: 260 },
      { id: "show-3", movieId: "movie-3", date: "2026-07-12", startTime: "11:35 PM", format: "IMAX", audioType: "Dolby Atmos", price: 320 },
    ],
  },
  {
    id: "theater-2",
    name: "PVR Gomti Nagar",
    location: "Gomti Nagar, Lucknow",
    city: "Lucknow",
    state: "Uttar Pradesh",
    logo: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=200&q=80",
    distance: "3.3 km",
    cancellation: "Non-cancellable",
    showtimes: [
      { id: "show-4", movieId: "movie-1", date: "2026-07-12", startTime: "2:00 PM", format: "2D", audioType: "Dolby 5.1", price: 200 },
      { id: "show-5", movieId: "movie-3", date: "2026-07-12", startTime: "7:45 PM", format: "3D", audioType: "Dolby Atmos", price: 300 },
    ],
  },
];

const defaultState: DbState = {
  users: [],
  movies: sampleMovies,
  theaters: sampleTheaters,
  bookings: [],
};

const ensureDatabase = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const file = await fs.readFile(DB_FILE, "utf8");
    if (!file) {
      await fs.writeFile(DB_FILE, JSON.stringify(defaultState, null, 2));
    }
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(defaultState, null, 2));
  }
};

const readDatabase = async (): Promise<DbState> => {
  await ensureDatabase();
  const raw = await fs.readFile(DB_FILE, "utf8");
  return JSON.parse(raw) as DbState;
};

const writeDatabase = async (state: DbState) => {
  await ensureDatabase();
  await fs.writeFile(DB_FILE, JSON.stringify(state, null, 2));
};

const hashPassword = (password: string) => {
  return crypto.scryptSync(password, JWT_SECRET, 64).toString("hex");
};

const comparePassword = (password: string, stored: string) => {
  return hashPassword(password) === stored;
};

const createToken = (user: User) => {
  return jwt.sign({ id: user.id, email: user.email, name: user.name, phone: user.phone }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sanitizeUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  createdAt: user.createdAt,
});

const asyncHandler = (
  handler: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<unknown> | unknown
) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  void (async () => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;

      if (!token) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string; name: string; phone: string };
      const db = await readDatabase();
      const user = db.users.find((entry) => entry.id === payload.id);

      if (!user) {
        res.status(401).json({ message: "Authentication failed" });
        return;
      }

      (req as any).user = user;
      next();
    } catch {
      res.status(401).json({ message: "Authentication failed" });
    }
  })();
};

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", message: "GrabATicket API is live" });
});

app.post(
  "/api/v1/auth/signup",
  asyncHandler(async (req, res) => {
    try {
      const { name, email, phone, password } = req.body || {};
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }

      const db = await readDatabase();
      const existing = db.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
      if (existing) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }

      const user: User = {
        id: `user-${Date.now()}`,
        name: String(name),
        email: String(email).toLowerCase(),
        phone: String(phone || ""),
        password: hashPassword(String(password)),
        createdAt: new Date().toISOString(),
      };

      db.users.push(user);
      await writeDatabase(db);

      const token = createToken(user);
      res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 7 });

      return res.status(201).json({ user: sanitizeUser(user), token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to create account" });
    }
  })
);

app.post(
  "/api/v1/auth/login",
  asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const db = await readDatabase();
      const user = db.users.find((entry) => entry.email.toLowerCase() === String(email).toLowerCase());
      if (!user || !comparePassword(String(password), user.password)) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = createToken(user);
      res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 7 });
      return res.json({ user: sanitizeUser(user), token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to sign in" });
    }
  })
);

app.get(
  "/api/v1/auth/me",
  authMiddleware,
  asyncHandler(async (req, res) => {
    return res.json({ user: sanitizeUser((req as any).user) });
  })
);

app.get(
  "/api/v1/movies",
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const search = String(req.query.search || "").trim().toLowerCase();
      const nowShowing = String(req.query.nowShowing || "").trim();
      const page = Math.max(1, Number(req.query.page) || 1);
      const rawLimit = Number(req.query.limit);
      const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(200, rawLimit) : 0;

      let movies = db.movies.filter((movie) => {
        if (search && !`${movie.title} ${movie.genre}`.toLowerCase().includes(search)) return false;
        if (nowShowing === "true" && !movie.nowShowing) return false;
        return true;
      });

      const total = movies.length;
      if (limit) {
        const start = (page - 1) * limit;
        movies = movies.slice(start, start + limit);
      }

      return res.json({ movies, total });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to fetch movies" });
    }
  })
);

app.get(
  "/api/v1/movies/:id",
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const movie = db.movies.find((entry) => entry.id === req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      return res.json({ movie });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to fetch movie" });
    }
  })
);

app.post(
  "/api/v1/movies",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const movie: Movie = {
        id: `movie-${Date.now()}`,
        title: String(req.body?.title || "Untitled"),
        genre: String(req.body?.genre || "General"),
        rating: Number(req.body?.rating || 0),
        votes: String(req.body?.votes || "0"),
        img: String(req.body?.img || ""),
        languages: String(req.body?.languages || ""),
        age: String(req.body?.age || ""),
        description: String(req.body?.description || ""),
        duration: String(req.body?.duration || ""),
        promoted: Boolean(req.body?.promoted),
      };

      db.movies.push(movie);
      await writeDatabase(db);
      return res.status(201).json({ movie });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to create movie" });
    }
  })
);

app.put(
  "/api/v1/movies/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const index = db.movies.findIndex((movie) => movie.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Movie not found" });
      }
      db.movies[index] = { ...db.movies[index], ...req.body };
      await writeDatabase(db);
      return res.json({ movie: db.movies[index] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to update movie" });
    }
  })
);

app.delete(
  "/api/v1/movies/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      db.movies = db.movies.filter((movie) => movie.id !== req.params.id);
      await writeDatabase(db);
      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to delete movie" });
    }
  })
);

app.get(
  "/api/v1/theaters",
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const city = String(req.query.city || "").trim();
      const theaters = city ? db.theaters.filter((theater) => theater.city.toLowerCase() === city.toLowerCase()) : db.theaters;
      return res.json({ theaters });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to fetch theaters" });
    }
  })
);

app.get(
  "/api/v1/theaters/:id",
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const theater = db.theaters.find((entry) => entry.id === req.params.id);
      if (!theater) {
        return res.status(404).json({ message: "Theater not found" });
      }
      return res.json({ theater });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to fetch theater" });
    }
  })
);

app.post(
  "/api/v1/theaters",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const theater: Theater = {
        id: `theater-${Date.now()}`,
        name: String(req.body?.name || "Untitled theater"),
        location: String(req.body?.location || ""),
        city: String(req.body?.city || ""),
        state: String(req.body?.state || ""),
        logo: String(req.body?.logo || ""),
        distance: String(req.body?.distance || ""),
        cancellation: String(req.body?.cancellation || ""),
        showtimes: [],
      };

      db.theaters.push(theater);
      await writeDatabase(db);
      return res.status(201).json({ theater });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to create theater" });
    }
  })
);

app.put(
  "/api/v1/theaters/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const index = db.theaters.findIndex((theater) => theater.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Theater not found" });
      }
      db.theaters[index] = { ...db.theaters[index], ...req.body };
      await writeDatabase(db);
      return res.json({ theater: db.theaters[index] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to update theater" });
    }
  })
);

app.delete(
  "/api/v1/theaters/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      db.theaters = db.theaters.filter((theater) => theater.id !== req.params.id);
      await writeDatabase(db);
      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to delete theater" });
    }
  })
);

app.get(
  "/api/v1/shows",
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const movieId = String(req.query.movie || "").trim();
      const matchedTheaters = db.theaters.filter((theater) => {
        if (!movieId) return true;
        return (theater.showtimes || []).some((show) => show.movieId === movieId);
      });

      const shows = matchedTheaters.map((theater) => ({
        theaterId: theater.id,
        name: theater.name,
        location: theater.location,
        city: theater.city,
        state: theater.state,
        logo: theater.logo,
        distance: theater.distance,
        cancellation: theater.cancellation,
        showtimes: (theater.showtimes || []).filter((show) => (!movieId ? true : show.movieId === movieId)),
      }));

      return res.json({ shows });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to fetch shows" });
    }
  })
);

app.get(
  "/api/v1/bookings/me",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const bookings = db.bookings.filter((booking) => booking.userId === (req as any).user.id);
      return res.json({ bookings });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to fetch bookings" });
    }
  })
);

app.post(
  "/api/v1/bookings",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const booking: Booking = {
        id: `booking-${Date.now()}`,
        userId: (req as any).user.id,
        movieId: String(req.body?.movieId || ""),
        title: String(req.body?.movieTitle || ""),
        poster: String(req.body?.poster || ""),
        cinema: String(req.body?.theaterName || ""),
        date: String(req.body?.date || ""),
        time: String(req.body?.time || ""),
        datetime: String(req.body?.datetime || ""),
        seats: Array.isArray(req.body?.seats) ? req.body.seats : String(req.body?.seats || "").split(","),
        quantity: Number(req.body?.quantity || 1),
        total: Number(req.body?.total || 0),
        ticket: Number(req.body?.ticket || 0),
        fee: Number(req.body?.fee || 0),
        format: String(req.body?.format || "2D"),
        paymentMethod: String(req.body?.paymentMethod || "Credit/Debit Card"),
        createdAt: new Date().toISOString(),
      };

      db.bookings.unshift(booking);
      await writeDatabase(db);
      return res.status(201).json({ booking });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to create booking" });
    }
  })
);

app.get(
  "/api/v1/bookings/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const booking = db.bookings.find((entry) => entry.id === req.params.id && entry.userId === (req as any).user.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      return res.json({ booking });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to fetch booking" });
    }
  })
);

app.delete(
  "/api/v1/bookings/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const db = await readDatabase();
      const existed = db.bookings.some((booking) => booking.id === req.params.id);
      db.bookings = db.bookings.filter((booking) => booking.id !== req.params.id);
      await writeDatabase(db);
      return res.json({ success: existed });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to delete booking" });
    }
  })
);

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to GrabATicket API" });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
