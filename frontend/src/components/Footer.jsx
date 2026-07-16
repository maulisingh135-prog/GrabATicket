import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="mt-16 border-t border-[var(--line)] bg-[var(--surface)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
      <div className="col-span-2 sm:col-span-1">
        <p className="font-display text-lg font-semibold mb-2">
          Grab<span className="text-[var(--accent)]">A</span>Ticket
        </p>
        <p className="text-sm text-[var(--muted)]">
          Your seat, your show, your city — booked in a minute.
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">Explore</p>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="hover:text-[var(--accent)]">Now Showing</Link></li>
          <li><Link to="/#cinemas" className="hover:text-[var(--accent)]">Cinemas near you</Link></li>
          <li><Link to="/wishlist" className="hover:text-[var(--accent)]">Wishlist</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">Account</p>
        <ul className="space-y-2 text-sm">
          <li><Link to="/dashboard" className="hover:text-[var(--accent)]">Dashboard</Link></li>
          <li><Link to="/bookings" className="hover:text-[var(--accent)]">Booking History</Link></li>
          <li><Link to="/login" className="hover:text-[var(--accent)]">Log in</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">GrabATicket</p>
        <ul className="space-y-2 text-sm text-[var(--muted)]">
          <li>Help centre</li>
          <li>Terms of use</li>
          <li>Privacy policy</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-[var(--line)] py-4 text-center text-xs text-[var(--muted)]">
      © {new Date().getFullYear()} GrabATicket. Built for the show must go on.
    </div>
  </footer>
);

export default Footer;
