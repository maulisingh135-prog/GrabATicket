import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Error 404</p>
    <h1 className="font-display text-4xl font-medium mb-3">This show has ended</h1>
    <p className="text-sm text-[var(--muted)] mb-6 max-w-sm">
      The page you're looking for isn't playing here anymore.
    </p>
    <Link to="/" className="bg-[var(--accent)] text-white text-sm font-medium px-5 py-2.5 rounded-full">
      Back to GrabATicket
    </Link>
  </div>
);

export default NotFound;
