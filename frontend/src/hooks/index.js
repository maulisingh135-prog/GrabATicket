import { useEffect, useState } from "react";

export { useAuth } from "../context/AuthContext";
export { useWishlist } from "../context/WishlistContext";
export { useBookings } from "../context/BookingContext";
export { useTheme } from "../context/ThemeContext";

// Generic localStorage-backed state, handy for small UI preferences
// (e.g. remembering the last selected city or filter).
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable, ignore */
    }
  }, [key, value]);

  return [value, setValue];
};
