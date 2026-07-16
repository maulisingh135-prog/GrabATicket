import { useState } from "react";
import { FiFilm } from "react-icons/fi";

// A small deterministic palette of poster-worthy gradients. We pick one per
// movie based on a hash of its title so the same movie always gets the same
// placeholder, instead of a random one flashing on every render.
const PALETTES = [
  ["#c8352e", "#3a1210"],
  ["#1f2e4a", "#0b1220"],
  ["#3a5f4f", "#0e1f18"],
  ["#6b3fa0", "#1c1030"],
  ["#b5893a", "#2a1d0a"],
  ["#1f6f78", "#0b2226"],
  ["#8a2b5c", "#26091a"],
  ["#3f5c7a", "#0d1a26"],
];

const hashString = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const initials = (title = "") =>
  title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/**
 * PosterImage
 * Props: src, alt, title, genre, className
 * Renders a real <img> when `src` resolves; if `src` is missing or fails to
 * load, renders a generated poster card instead of leaving a blank/broken image.
 */
const PosterImage = ({ src, alt, title = "", genre = "", className = "" }) => {
  const [errored, setErrored] = useState(false);
  const showPlaceholder = !src || errored;

  if (showPlaceholder) {
    const idx = hashString(title || alt) % PALETTES.length;
    const [from, to] = PALETTES[idx];
    const genreLabel = (genre || "").split("/")[0]?.trim();

    return (
      <div
        className={`flex flex-col items-center justify-center text-center p-3 ${className}`}
        style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
        role="img"
        aria-label={alt || title}
      >
        <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
          <FiFilm className="text-white/80" size={16} />
        </span>
        <p className="font-display text-white text-sm font-medium leading-tight line-clamp-3">
          {title || "Untitled"}
        </p>
        {genreLabel && (
          <p className="text-white/60 text-[10px] font-mono uppercase tracking-wide mt-1">
            {genreLabel}
          </p>
        )}
        <span className="mt-2 text-white/25 text-[9px] font-mono">{initials(title)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || title}
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
};

export default PosterImage;
