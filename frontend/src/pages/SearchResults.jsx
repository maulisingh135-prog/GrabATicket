import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { MovieCard, PosterImage } from "../components";
import { searchMovies, getTheaters } from "../apis";

const SearchResults = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      const normalizedQuery = q.trim().toLowerCase();
      if (!normalizedQuery) {
        setMovies([]);
        setTheatres([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [moviesResponse, theatresResponse] = await Promise.all([
          searchMovies(normalizedQuery, 30),
          getTheaters(),
        ]);
        const allTheatres = theatresResponse.data.theaters || [];
        const filteredTheatres = allTheatres.filter((theater) =>
          `${theater.name} ${theater.location} ${theater.city}`.toLowerCase().includes(normalizedQuery)
        );

        setMovies(moviesResponse.data.movies || []);
        setTheatres(filteredTheatres);
      } catch {
        setMovies([]);
        setTheatres([]);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Search results</p>
      <h1 className="font-display text-2xl font-medium mb-8">"{q}"</h1>

      {loading ? (
        <div className="text-center py-20 rounded-2xl ring-1 ring-dashed ring-[var(--line)]">
          <p className="text-sm text-[var(--muted)]">Searching live results...</p>
        </div>
      ) : movies.length === 0 && theatres.length === 0 ? (
        <div className="text-center py-20 rounded-2xl ring-1 ring-dashed ring-[var(--line)]">
          <FiSearch className="mx-auto text-[var(--muted)] mb-3" size={28} />
          <p className="text-sm text-[var(--muted)]">No movies or cinemas matched your search.</p>
          <Link to="/" className="text-[var(--accent)] text-sm font-medium mt-2 inline-block">Back to home</Link>
        </div>
      ) : (
        <>
          {movies.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-lg font-medium mb-4">Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                {movies.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </section>
          )}
          {theatres.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-medium mb-4">Cinemas</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {theatres.map((t) => (
                  <div key={t.name} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--line)]">
                    <PosterImage
                      src={t.logo || t.img}
                      alt={t.name}
                      title={t.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium leading-tight">{t.name}</p>
                      <p className="text-xs text-[var(--muted)] mt-1">{t.distance} away</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
