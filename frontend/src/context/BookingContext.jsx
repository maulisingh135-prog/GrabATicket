import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getMyBookings, createBooking } from "../apis";

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.id) {
        setBookings([]);
        return;
      }

      try {
        setLoading(true);
        const { data } = await getMyBookings();
        setBookings(data.bookings || []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user?.id]);

  const addBooking = async (booking) => {
    if (!user?.id) return;
    const { data } = await createBooking({
      movieId: booking.movieId,
      movieTitle: booking.title,
      poster: booking.poster,
      theaterName: booking.cinema,
      date: booking.date,
      time: booking.time,
      datetime: booking.datetime,
      seats: booking.seats.split(", ").map((seat) => seat.trim()),
      quantity: booking.quantity,
      total: booking.total,
      ticket: booking.ticket,
      fee: booking.fee,
      format: booking.format,
      paymentMethod: booking.paymentMethod,
    });

    setBookings((current) => [data.booking, ...current]);
  };

  return (
    <BookingContext.Provider value={{ bookings, loading, addBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used within a BookingProvider");
  return ctx;
};
