import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiMapPin } from "react-icons/fi";
import { MovieCard, PosterImage } from "../components";
import { banners, events } from "../utils/constants";
import { getMovies, getTheaters } from "../apis";

const Home = () => {
  const [banner] = useState(banners[0]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [moviesResponse, theatresResponse] = await Promise.all([
          getMovies({ nowShowing: true, limit: 40 }),
          getTheaters(),
        ]);
        setMovies(moviesResponse.data.movies || []);
        setTheatres(theatresResponse.data.theaters || []);
      } catch {
        setMovies([]);
        setTheatres([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div
          className="h-[420px] sm:h-[480px] w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--paper)] via-black/30 to-black/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/80 mb-3">
              Now booking · Lucknow &amp; beyond
            </p>
            <h1 className="font-display text-4xl sm:text-6xl text-white font-medium max-w-xl leading-[1.05]">
              The Odyssey
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[11px] font-mono uppercase tracking-wide bg-white/15 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                Adventure
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wide bg-white/15 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                Fantasy
              </span>
            </div>
            <p className="text-white/85 mt-4 max-w-md text-sm sm:text-base">
              A mythic voyage home, reborn for the big screen: a war-weary king battles monsters,
              gods, and the sea itself in a sweeping, larger-than-life epic built for IMAX.
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/70 mt-3">
              Release Date: 17 July
            </p>
            <Link
              to="/movie/movie-9"
              className="mt-6 inline-flex items-center gap-2 bg-[var(--accent)] text-white text-sm font-medium px-5 py-3 rounded-full w-fit hover:bg-[var(--accent-dark)] transition"
            >
              Book Now <FiChevronRight />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Location strip */}
        <div className="flex items-center gap-2 text-sm text-[var(--muted)] -mt-6 relative z-10 bg-[var(--surface)] w-fit px-4 py-2 rounded-full shadow-sm ring-1 ring-[var(--line)]">
          <FiMapPin className="text-[var(--accent)]" />
          Showing cinemas near <span className="font-medium text-[var(--ink)]">Lucknow</span>
        </div>

        {/* Recommended movies */}
        <section className="mt-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-2xl font-medium">Recommended Movies</h2>
            <a href="#now-showing" className="text-sm text-[var(--accent)] flex items-center gap-1">
              See all <FiChevronRight size={14} />
            </a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-44 sm:w-52 h-64 sm:h-72 rounded-2xl bg-[var(--line)]/40 animate-pulse" />
            ))}
            {!loading && movies.length > 0 ? movies.slice(0, 5).map((m) => (
              <MovieCard key={m.id} movie={m} />
            )) : null}
            {!loading && movies.length === 0 && (
              <p className="text-sm text-[var(--muted)]">No movies are available right now.</p>
            )}
          </div>
        </section>

        {/* Now showing full grid */}
        <section id="now-showing" className="mt-14 scroll-mt-24">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-2xl font-medium">Now Showing</h2>
            <p className="text-xs text-[var(--muted)]">Searching our full catalog? Try the search bar above.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {!loading && movies.length > 0 ? movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            )) : null}
            {!loading && movies.length === 0 && (
              <p className="text-sm text-[var(--muted)] col-span-full">No movies to display.</p>
            )}
          </div>
        </section>

        {/* Events */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-medium mb-4">Live Events &amp; Experiences</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {events.map((ev) => (
              <div key={ev.title} className="relative w-56 h-32 shrink-0 rounded-2xl overflow-hidden ring-1 ring-[var(--line)]">
                <img src={ev.img} alt={ev.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-start justify-end p-3">
                  <p className="text-white font-medium text-sm">{ev.title}</p>
                  <p className="text-white/80 text-xs">{ev.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cinemas */}
        <section id="cinemas" className="mt-14 mb-16 scroll-mt-24">
          <h2 className="font-display text-2xl font-medium mb-4">Popular Cinemas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {!loading && theatres.length > 0 ? theatres.slice(0, 6).map((t) => (
              <div key={t.id || t.name} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--line)]">
                <PosterImage
                  src={t.logo || t.img}
                  alt={t.name}
                  title={t.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div>
                  <p className="text-sm font-medium leading-tight">{t.name}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{t.location || t.city} · {t.cancellation || "Live shows"}</p>
                </div>
              </div>
            )) : null}
            {!loading && theatres.length === 0 && (
              <p className="text-sm text-[var(--muted)] col-span-full">No theaters are available right now.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
