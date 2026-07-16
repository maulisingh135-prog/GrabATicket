import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { MovieCard } from "../components";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-medium mb-1">Your wishlist</h1>
      <p className="text-sm text-[var(--muted)] mb-8">Movies you've saved to watch later.</p>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 rounded-2xl ring-1 ring-dashed ring-[var(--line)]">
          <FiHeart className="mx-auto text-[var(--muted)] mb-3" size={28} />
          <p className="text-sm text-[var(--muted)]">Nothing here yet.</p>
          <Link to="/" className="text-[var(--accent)] text-sm font-medium mt-2 inline-block">
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {wishlist.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
