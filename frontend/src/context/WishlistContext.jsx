import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

const keyFor = (userId) => `gat_wishlist_${userId || "guest"}`;

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(keyFor(user?.id))) || [];
      setWishlist(saved);
    } catch {
      setWishlist([]);
    }
  }, [user?.id]);

  const persist = (next) => {
    setWishlist(next);
    localStorage.setItem(keyFor(user?.id), JSON.stringify(next));
  };

  const isWishlisted = (movieId) => wishlist.some((m) => String(m.id) === String(movieId));

  const toggleWishlist = (movie) => {
    if (isWishlisted(movie.id)) {
      persist(wishlist.filter((m) => String(m.id) !== String(movie.id)));
      return false;
    }
    persist([...wishlist, movie]);
    return true;
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};
