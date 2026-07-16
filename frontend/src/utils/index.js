import { allMovies } from "./constants";

// ---------- Dates ----------
export const getNextDays = (count = 7) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d,
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      num: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      iso: d.toISOString().slice(0, 10),
      isToday: i === 0,
    });
  }
  return days;
};

export const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ---------- Pricing ----------
export const priceMap = {
  PREMIUM: 510,
  EXECUTIVE: 290,
  NORMAL: 270,
};

export const formatCurrency = (n) =>
  `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

// ---------- Seat matrix ----------
export const hashSeed = (str = "") => {
  let hash = 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 5000) + 1;
};

// Generates a deterministic-ish seat layout so the same show always renders
// the same matrix during a session (taken seats vary a little by seed).
export const generateSeatMatrix = (seed = 1) => {
  const layout = [
    { category: "PREMIUM", rows: ["A", "B"], seatsPerRow: 14, price: priceMap.PREMIUM },
    { category: "EXECUTIVE", rows: ["C", "D", "E"], seatsPerRow: 16, price: priceMap.EXECUTIVE },
    { category: "NORMAL", rows: ["F", "G", "H", "I"], seatsPerRow: 18, price: priceMap.NORMAL },
  ];

  let counter = seed * 7;
  const rand = () => {
    counter = (counter * 9301 + 49297) % 233280;
    return counter / 233280;
  };

  return layout.map((block) => ({
    ...block,
    rows: block.rows.map((rowLabel) => ({
      label: rowLabel,
      seats: Array.from({ length: block.seatsPerRow }, (_, i) => {
        const taken = rand() < 0.18;
        return {
          id: `${rowLabel}${i + 1}`,
          number: i + 1,
          taken,
        };
      }),
    })),
  }));
};

export const getMovieById = (id) => {
  const normalizedId = String(id || "").trim();
  if (!normalizedId) return undefined;

  return allMovies.find((movie) => {
    const stringId = String(movie.id);
    return (
      stringId === normalizedId ||
      `movie-${stringId}` === normalizedId ||
      stringId === normalizedId.replace(/^movie-/, "")
    );
  });
};

export const generateSlots = () => [
  "10:15 AM",
  "1:30 PM",
  "4:45 PM",
  "7:30 PM",
  "10:30 PM",
];
