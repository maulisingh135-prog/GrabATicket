import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiX, FiHeart, FiClock, FiUser, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { searchMovies, getTheaters } from "../apis";
import PosterImage from "./PosterImage";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ movies: [], theatres: [] });
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length <= 1) {
      setOpen(false);
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      const [moviesResponse, theatresResponse] = await Promise.all([
        searchMovies(trimmed, 5),
        getTheaters(),
      ]);
      if (!active) return;
      const q = trimmed.toLowerCase();
      const theatres = (theatresResponse.data.theaters || []).filter((t) =>
        `${t.name} ${t.location || t.city || ""}`.toLowerCase().includes(q)
      );
      setResults({ movies: moviesResponse.data.movies || [], theatres });
      setOpen(true);
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)]/95 backdrop-blur border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4 h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-display font-semibold text-sm">
            GT
          </span>
          <span className="font-display text-xl font-semibold tracking-tight hidden sm:block">
            Grab<span className="text-[var(--accent)]">A</span>Ticket
          </span>
        </Link>

        {/* Global search */}
        <div ref={boxRef} className="relative flex-1 max-w-xl">
          <form onSubmit={submitSearch} className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, cinemas..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full bg-[var(--paper)] border border-[var(--line)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition"
            />
          </form>

          {open && (
            <div className="absolute mt-2 w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl shadow-lg overflow-hidden max-h-96 overflow-y-auto">
              {results.movies.length === 0 && results.theatres.length === 0 && (
                <p className="p-4 text-sm text-[var(--muted)]">No matches for "{query}"</p>
              )}
              {results.movies.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-xs uppercase tracking-wide text-[var(--muted)]">Movies</p>
                  {results.movies.slice(0, 5).map((m) => (
                    <Link
                      key={m.id}
                      to={`/movie/${m.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[var(--paper)]"
                    >
                      <PosterImage
                        src={m.img}
                        alt={m.title}
                        title={m.title}
                        genre={m.genre}
                        className="w-9 h-12 object-cover rounded-md shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium leading-tight">{m.title}</p>
                        <p className="text-xs text-[var(--muted)]">{(m.genre || "").split("/")[0]}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {results.theatres.length > 0 && (
                <div className="p-2 border-t border-[var(--line)]">
                  <p className="px-2 py-1 text-xs uppercase tracking-wide text-[var(--muted)]">Cinemas</p>
                  {results.theatres.slice(0, 4).map((t) => (
                    <div key={t.id || t.name} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[var(--paper)]">
                      <PosterImage src={t.logo || t.img} alt={t.name} title={t.name} className="w-9 h-9 object-cover rounded-md shrink-0" />
                      <p className="text-sm">{t.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="shrink-0 p-2 rounded-full ring-1 ring-[var(--line)] hover:bg-[var(--paper)] transition"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 shrink-0">
          {isAuthenticated ? (
            <>
              <Link to="/wishlist" className="p-2 rounded-full hover:bg-[var(--paper)]" title="Wishlist">
                <FiHeart size={18} />
              </Link>
              <Link to="/bookings" className="p-2 rounded-full hover:bg-[var(--paper)]" title="Booking History">
                <FiClock size={18} />
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 ml-1 pl-3 pr-1 py-1 rounded-full hover:bg-[var(--paper)]"
              >
                <span className="w-7 h-7 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-xs font-semibold">
                  {user?.name?.[0]?.toUpperCase() || <FiUser size={14} />}
                </span>
              </Link>
              <button
                onClick={logout}
                className="ml-1 text-sm text-[var(--muted)] hover:text-[var(--accent)] px-2"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-2 rounded-full hover:bg-[var(--paper)]"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] transition"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        <button className="md:hidden p-2" onClick={() => setMobileOpen((o) => !o)}>
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--line)] px-4 py-3 flex flex-col gap-2 bg-[var(--surface)]">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="py-2 text-sm">Dashboard</Link>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="py-2 text-sm">Wishlist</Link>
              <Link to="/bookings" onClick={() => setMobileOpen(false)} className="py-2 text-sm">Booking History</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="py-2 text-sm text-left text-[var(--accent)]">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2 text-sm">Log in</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-[var(--accent)]">
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
