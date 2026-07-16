import { FiClock } from "react-icons/fi";
import { useBookings } from "../context/BookingContext";
import { formatCurrency } from "../utils";
import { PosterImage } from "../components";

const BookingHistory = () => {
  const { bookings } = useBookings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-medium mb-1">Booking history</h1>
      <p className="text-sm text-[var(--muted)] mb-8">Every ticket you've booked, all in one place.</p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 rounded-2xl ring-1 ring-dashed ring-[var(--line)]">
          <FiClock className="mx-auto text-[var(--muted)] mb-3" size={28} />
          <p className="text-sm text-[var(--muted)]">No bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--line)] overflow-hidden sm:flex">
              <PosterImage
                src={b.poster}
                alt={b.title}
                title={b.title}
                className="w-full sm:w-32 h-40 sm:h-auto object-cover"
              />
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-medium">{b.title}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{b.format} · {b.cinema}</p>
                  </div>
                  <span className="font-mono text-xs bg-[var(--paper)] px-2 py-1 rounded-md text-[var(--muted)]">#{b.id}</span>
                </div>

                <div className="ticket-perforation mt-4 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-[var(--muted)]">Date &amp; time</p>
                    <p className="font-mono mt-0.5">{b.datetime}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">Seats</p>
                    <p className="font-mono mt-0.5">{b.seats}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">Tickets</p>
                    <p className="font-mono mt-0.5">{b.quantity}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">Amount paid</p>
                    <p className="font-mono mt-0.5 text-[var(--accent)]">{formatCurrency(b.total)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
