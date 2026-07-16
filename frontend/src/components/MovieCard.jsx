import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import PosterImage from "./PosterImage";
import toast from "react-hot-toast";

const MovieCard = ({ movie }) => {
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const liked = isWishlisted(movie.id);

  const onWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Log in to save movies to your wishlist");
      return;
    }
    const added = toggleWishlist(movie);
    toast.success(added ? `Added "${movie.title}" to wishlist` : `Removed "${movie.title}" from wishlist`);
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group block shrink-0 w-44 sm:w-52">
      <div className="relative rounded-2xl overflow-hidden shadow-sm ring-1 ring-[var(--line)] bg-[var(--surface)] group-hover:shadow-md transition-shadow">
        <PosterImage
          src={movie.img}
          alt={movie.title}
          title={movie.title}
          genre={movie.genre}
          className="w-full h-64 sm:h-72 object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        <button
          onClick={onWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
          title="Save to wishlist"
        >
          <FiHeart size={15} className={liked ? "hidden" : "text-white"} />
          {liked && <FaHeart size={14} className="text-[var(--accent)]" />}
        </button>
        {movie.promoted && (
          <span className="absolute top-2 left-2 text-[10px] font-mono uppercase tracking-wide bg-[var(--gold)] text-white px-2 py-0.5 rounded-full">
            Ad
          </span>
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 pt-6 pb-2 flex items-center gap-1">
          <FaStar size={11} className="text-[var(--gold)]" />
          <span className="text-white text-xs font-mono">{movie.rating}/10</span>
          <span className="text-white/70 text-[11px]">· {movie.votes} votes</span>
        </div>
      </div>
      <div className="ticket-perforation mt-2 pt-2">
        <p className="text-sm font-medium leading-tight truncate">{movie.title}</p>
        <p className="text-xs text-[var(--muted)] truncate">{(movie.genre || "").split("/").slice(0, 2).join(" · ")}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
