import axios from "axios";
import { allMovies, theatres } from "../utils/constants";
import { getMovieById as getMovieByIdFromUtils } from "../utils";

// GrabATicket talks to the backend (see /backend) for movies, theaters, shows
// and bookings. If the backend is unreachable, calls fall back to a small
// bundled mock catalog (src/utils/constants.js) so the UI still renders.
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:9000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const session = localStorage.getItem("gat_session");
  if (session) {
    const parsed = JSON.parse(session);
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

const fallbackResponse = (data) => ({ data });
const withApiFallback = async (requestFn, fallback) => {
  try {
    return await requestFn();
  } catch (error) {
    console.warn("API fallback engaged:", error?.message || error);
    return fallbackResponse(fallback);
  }
};

const normalizeMovie = (movie) => {
  if (!movie) return movie;
  const localMovie = getMovieByIdFromUtils(movie.id) || allMovies.find((m) => m.title === movie.title);
  if (!localMovie) return movie;
  return {
    ...movie,
    img: localMovie.img,
    languages: movie.languages || localMovie.languages,
    age: movie.age || localMovie.age,
    genre: movie.genre || localMovie.genre,
    duration: movie.duration || localMovie.duration,
    description: movie.description || localMovie.description,
  };
};

const normalizeMovies = (movies = []) => movies.map(normalizeMovie);

export const getMovies = ({ nowShowing, limit, page } = {}) =>
  withApiFallback(
    async () => {
      const response = await api.get("/movies", { params: { nowShowing, limit, page } });
      return {
        data: {
          movies: normalizeMovies(response.data.movies || []),
          total: response.data.total,
        },
      };
    },
    { movies: allMovies, total: allMovies.length }
  );

export const searchMovies = (query, limit = 6) =>
  withApiFallback(
    async () => {
      const response = await api.get("/movies", { params: { search: query, limit } });
      return { data: { movies: normalizeMovies(response.data.movies || []) } };
    },
    {
      movies: allMovies.filter((m) =>
        `${m.title} ${m.genre}`.toLowerCase().includes(query.trim().toLowerCase())
      ),
    }
  );

export const getMovieById = (id) =>
  withApiFallback(
    async () => {
      const response = await api.get(`/movies/${id}`);
      return {
        data: {
          movie: normalizeMovie(response.data.movie),
        },
      };
    },
    { movie: getMovieByIdFromUtils(id) }
  );

export const getShowsForMovie = (id) =>
  withApiFallback(() => api.get("/shows", { params: { movie: id } }), { shows: [] });

export const getTheaters = () =>
  withApiFallback(() => api.get("/theaters"), { theaters: theatres });

export const createBooking = (payload) => api.post("/bookings", payload);
export const getMyBookings = () => api.get("/bookings/me");
