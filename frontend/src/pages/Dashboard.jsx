import { Link } from "react-router-dom";
import { FiHeart, FiClock, FiUser, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useBookings } from "../context/BookingContext";
import { MovieCard, PosterImage } from "../components";

const Dashboard = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { bookings } = useBookings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-4 mb-10">
        <span className="w-14 h-14 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-xl font-semibold">
          {user?.name?.[0]?.toUpperCase() || <FiUser />}
        </span>
        <div>
          <h1 className="font-display text-2xl font-medium">Hi, {user?.name?.split(" ")[0] || "there"}</h1>
          <p className="text-sm text-[var(--muted)]">{user?.email}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <StatCard icon={<FiHeart />} label="Wishlisted movies" value={wishlist.length} to="/wishlist" />
        <StatCard icon={<FiClock />} label="Past bookings" value={bookings.length} to="/bookings" />
        <StatCard icon={<FiUser />} label="Member since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"} />
      </div>

      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl font-medium">Your wishlist</h2>
          <Link to="/wishlist" className="text-sm text-[var(--accent)] flex items-center gap-1">
            View all <FiChevronRight size={14} />
          </Link>
        </div>
        {wishlist.length === 0 ? (
          <EmptyRow text="Nothing saved yet. Tap the heart on any movie to add it here." />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {wishlist.slice(0, 6).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl font-medium">Recent bookings</h2>
          <Link to="/bookings" className="text-sm text-[var(--accent)] flex items-center gap-1">
            View all <FiChevronRight size={14} />
          </Link>
        </div>
        {bookings.length === 0 ? (
          <EmptyRow text="No bookings yet. Your confirmed tickets will show up here." />
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--line)]">
                <PosterImage
                  src={b.poster}
                  alt={b.title}
                  title={b.title}
                  className="w-12 h-16 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{b.title}</p>
                  <p className="text-xs text-[var(--muted)]">{b.datetime} · {b.cinema}</p>
                </div>
                <span className="font-mono text-xs text-[var(--muted)]">#{b.id}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, to }) => {
  const content = (
    <div className="p-5 rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--line)] flex items-center gap-4 hover:ring-[var(--accent)]/40 transition">
      <span className="w-10 h-10 rounded-full bg-[var(--paper)] flex items-center justify-center text-[var(--accent)]">
        {icon}
      </span>
      <div>
        <p className="text-xl font-display font-medium leading-none">{value}</p>
        <p className="text-xs text-[var(--muted)] mt-1">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

const EmptyRow = ({ text }) => (
  <div className="p-6 rounded-2xl bg-[var(--surface)] ring-1 ring-dashed ring-[var(--line)] text-sm text-[var(--muted)] text-center">
    {text}
  </div>
);

export default Dashboard;
