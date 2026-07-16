import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiClock, FiCalendar, FiChevronLeft, FiHeart } from "react-icons/fi";
import { FaStar, FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { getNextDays } from "../utils";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { getMovieById as getMovieFromApi, getShowsForMovie } from "../apis";
import { PosterImage } from "../components";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const days = useMemo(() => getNextDays(7), []);
  const [selectedDate, setSelectedDate] = useState(days[0]);
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const [movieResponse, showsResponse] = await Promise.all([getMovieFromApi(id), getShowsForMovie(id)]);
        setMovie(movieResponse.data.movie);
        setShows(showsResponse.data.shows || []);
      } catch {
        setMovie(null);
        setShows([]);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><p className="text-lg font-medium">Loading movie details...</p></div>;
  }

  if (!movie) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-lg font-medium">We couldn't find that movie.</p>
        <Link to="/" className="text-[var(--accent)] text-sm mt-2 inline-block">Back to home</Link>
      </div>
    );
  }

  const liked = isWishlisted(movie.id);

  const onWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Log in to save movies to your wishlist");
      return;
    }
    const added = toggleWishlist(movie);
    toast.success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  const bookSlot = (theatre, time) => {
    if (!isAuthenticated) {
      toast.error("Log in to select seats");
      navigate("/login", {
        state: {
          from: `/movie/${movie.id}/seats?theatre=${encodeURIComponent(theatre.name)}&time=${encodeURIComponent(time)}&date=${selectedDate.iso}`,
        },
      });
      return;
    }
    navigate(
      `/movie/${movie.id}/seats?theatre=${encodeURIComponent(theatre.name)}&time=${encodeURIComponent(time)}&date=${selectedDate.iso}`
    );
  };

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-72 sm:h-96">
        <PosterImage
          src={movie.img}
          alt={movie.title}
          title={movie.title}
          genre={movie.genre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--paper)] via-black/40 to-black/10" />
        <Link to="/" className="absolute top-4 left-4 sm:left-6 bg-black/40 text-white rounded-full p-2">
          <FiChevronLeft size={18} />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative">
        <div className="flex gap-5 items-end">
          <PosterImage
            src={movie.img}
            alt={movie.title}
            title={movie.title}
            genre={movie.genre}
            className="w-32 sm:w-40 h-44 sm:h-56 rounded-2xl ring-4 ring-[var(--paper)] object-cover shadow-lg shrink-0"
          />
          <div className="pb-2 flex-1">
            <h1 className="font-display text-2xl sm:text-3xl font-medium text-[var(--ink)]">{movie.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1 font-mono">
                <FaStar className="text-[var(--gold)]" size={12} /> {movie.rating}/10
              </span>
              <span>· {movie.votes} votes</span>
              <span className="hidden sm:inline">· {movie.age}</span>
            </div>
          </div>
          <button
            onClick={onWishlist}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full ring-1 ring-[var(--line)] bg-[var(--surface)] text-sm mb-2"
          >
            {liked ? <FaHeart className="text-[var(--accent)]" size={16} /> : <FiHeart size={16} />}
            {liked ? "Wishlisted" : "Wishlist"}
          </button>
        </div>

        <p className="mt-6 text-sm text-[var(--muted)] max-w-2xl">
          {(movie.genre || "").split("/").join(" · ")} — {movie.languages || "Multiple languages"} — Certified {movie.age || "UA"}.
        </p>

        {movie.description && (
          <p className="mt-3 text-sm text-[var(--ink)]/80 max-w-2xl leading-relaxed">{movie.description}</p>
        )}

        {(movie.director || movie.cast) && (
          <div className="mt-4 text-sm text-[var(--muted)] max-w-2xl space-y-1">
            {movie.director && (
              <p><span className="text-[var(--ink)] font-medium">Director:</span> {movie.director}</p>
            )}
            {movie.cast && (
              <p><span className="text-[var(--ink)] font-medium">Cast:</span> {movie.cast}</p>
            )}
          </div>
        )}

        {/* Date selector */}
        <section className="mt-10">
          <p className="flex items-center gap-2 text-sm font-medium mb-3">
            <FiCalendar className="text-[var(--accent)]" /> Choose date
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {days.map((d) => (
              <button
                key={d.iso}
                onClick={() => setSelectedDate(d)}
                className={`shrink-0 w-16 py-3 rounded-xl text-center border transition ${
                  selectedDate.iso === d.iso
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-[var(--surface)] border-[var(--line)] hover:border-[var(--accent)]/50"
                }`}
              >
                <p className="text-xs font-mono uppercase">{d.day}</p>
                <p className="text-lg font-display leading-none mt-0.5">{d.num}</p>
                <p className="text-[10px] uppercase">{d.month}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Showtimes by cinema */}
        <section className="mt-10 mb-16">
          <p className="flex items-center gap-2 text-sm font-medium mb-3">
            <FiClock className="text-[var(--accent)]" /> Showtimes near Lucknow
          </p>
          <div className="space-y-4">
            {shows.length > 0 ? shows.map((t) => (
              <div key={t.theaterId || t.name} className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--line)]">
                <div className="flex items-center gap-3 mb-3">
                  <PosterImage
                    src={t.logo}
                    alt={t.name}
                    title={t.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-[var(--muted)]">{t.location || t.city} · {t.cancellation || "Live shows"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.showtimes.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => bookSlot({ name: t.name }, slot.startTime)}
                      className="px-3 py-2 rounded-lg text-xs font-mono border border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                    >
                      {slot.startTime}
                      <span className="block text-[9px] opacity-70">{slot.format}</span>
                    </button>
                  ))}
                </div>
              </div>
            )) : (
              <p className="text-sm text-[var(--muted)]">No showtimes are available for this movie yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;
