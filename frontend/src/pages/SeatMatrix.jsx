import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import { generateSeatMatrix, formatCurrency, formatDate, hashSeed } from "../utils";
import { getMovieById as getMovieFromApi } from "../apis";
import { useBookings } from "../context/BookingContext";
import PosterImage from "../components/PosterImage";

const MAX_SEATS = 8;

const SeatMatrix = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addBooking } = useBookings();

  const theatreName = params.get("theatre") || "GrabATicket Cinema";
  const time = params.get("time") || "7:30 PM";
  const date = params.get("date");

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const blocks = useMemo(() => generateSeatMatrix(hashSeed(id)), [id]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getMovieFromApi(id).then((response) => {
      if (!active) return;
      setMovie(response.data.movie || null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-lg font-medium">Loading seat map...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-lg font-medium">We couldn't find that movie.</p>
        <Link to="/" className="text-[var(--accent)] text-sm mt-2 inline-block">Back to home</Link>
      </div>
    );
  }

  const toggleSeat = (seat, price, category) => {
    if (seat.taken) return;
    const exists = selected.find((s) => s.id === seat.id);
    if (exists) {
      setSelected(selected.filter((s) => s.id !== seat.id));
      return;
    }
    if (selected.length >= MAX_SEATS) {
      toast.error(`You can select up to ${MAX_SEATS} seats`);
      return;
    }
    setSelected([...selected, { ...seat, price, category }]);
  };

  const total = selected.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selected.length ? Math.round(selected.length * 24.42) : 0;
  const grandTotal = total + convenienceFee;

  const confirmBooking = async () => {
    if (!selected.length) {
      toast.error("Select at least one seat to continue");
      return;
    }
    const booking = {
      id: Math.random().toString(36).slice(2, 9).toUpperCase(),
      movieId: id,
      title: movie.title,
      format: "2D",
      datetime: `${date ? formatDate(date) : "Today"} | ${time}`,
      cinema: theatreName,
      quantity: selected.length,
      seats: selected.map((s) => s.id).join(", "),
      bookingTime: new Date().toLocaleString(),
      paymentMethod: "Credit/Debit Card",
      poster: movie.img,
      total: grandTotal,
      ticket: total,
      fee: convenienceFee,
      date: date || new Date().toISOString().slice(0, 10),
      time,
    };
    try {
      await addBooking(booking);
      toast.success("Booking confirmed! Enjoy the show 🎬");
      navigate("/bookings");
    } catch (error) {
      toast.error(error.message || "Unable to confirm booking");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-[var(--muted)] mb-4">
        <FiChevronLeft /> Back
      </button>

      <div className="flex items-center gap-4 mb-8">
        <PosterImage
          src={movie.img}
          alt={movie.title}
          title={movie.title}
          genre={movie.genre}
          className="w-14 h-20 rounded-lg object-cover shrink-0"
        />
        <div>
          <h1 className="font-display text-xl font-medium">{movie.title}</h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            {theatreName} · {date ? formatDate(date) : "Today"} · {time}
          </p>
        </div>
      </div>

      {/* Screen */}
      <div className="mb-8">
        <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-[var(--gold)]/70 to-transparent mx-auto max-w-2xl mb-1 shadow-[0_8px_24px_-6px_var(--gold)]" />
        <p className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--muted)]">Screen this way</p>
      </div>

      <div className="space-y-6 overflow-x-auto">
        {blocks.map((block) => (
          <div key={block.category}>
            <p className="text-xs font-mono uppercase tracking-wide text-[var(--muted)] mb-2">
              {block.category} · {formatCurrency(block.price)}
            </p>
            <div className="space-y-1.5">
              {block.rows.map((row) => (
                <div key={row.label} className="flex items-center gap-2 justify-center">
                  <span className="w-4 text-[10px] font-mono text-[var(--muted)]">{row.label}</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {row.seats.map((seat) => {
                      const isSelected = selected.some((s) => s.id === seat.id);
                      return (
                        <button
                          key={seat.id}
                          disabled={seat.taken}
                          onClick={() => toggleSeat(seat, block.price, block.category)}
                          title={seat.id}
                          className={`seat w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[9px] flex items-center justify-center border ${
                            seat.taken
                              ? "seat-taken bg-[var(--line)] text-[var(--muted)] border-[var(--line)] cursor-not-allowed"
                              : isSelected
                              ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                              : "bg-[var(--surface)] border-[var(--line)] hover:border-[var(--accent)]"
                          }`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-8 text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[var(--surface)] border border-[var(--line)]" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[var(--accent)]" /> Selected</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[var(--line)]" /> Taken</span>
      </div>

      {/* Sticky summary bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-[var(--ink)] text-white z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-mono">{selected.map((s) => s.id).join(", ")}</p>
              <p className="text-xs text-white/60 mt-0.5">
                {selected.length} seat{selected.length > 1 ? "s" : ""} · {formatCurrency(grandTotal)} incl. fees
              </p>
            </div>
            <button
              onClick={confirmBooking}
              className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] transition text-white text-sm font-medium px-6 py-3 rounded-full shrink-0"
            >
              Confirm booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMatrix;
