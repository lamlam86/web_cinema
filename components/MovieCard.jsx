"use client";
import Link from "next/link";
import MoviePoster from "./MoviePoster";

export default function MovieCard({ movie, variant = "now_showing" }) {
  const isComingSoon = variant === "coming_soon" || movie.status === "coming_soon";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className={`mv-card ${isComingSoon ? "mv-card--coming" : ""}`}>
      <div className="mv-card__poster">
        <MoviePoster poster_url={movie.poster || movie.poster_url} title={movie.title} />
        
        <div className="mv-card__badges">
          {movie.rating && (
            <span className={`mv-card__badge mv-card__badge--age ${movie.rating}`}>
              {movie.rating}
            </span>
          )}
        </div>

        <div className="mv-card__info-overlay">
          <h4 className="mv-card__info-title">{movie.title}</h4>
          <div className="mv-card__info-list">
            {movie.duration && (
              <div className="mv-card__info-item">
                <span className="mv-card__info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                {movie.duration} phút
              </div>
            )}
            {movie.genres && (
              <div className="mv-card__info-item">
                <span className="mv-card__info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 11a9 9 0 0 1 9 9" />
                    <path d="M4 4a16 16 0 0 1 16 16" />
                    <circle cx="5" cy="19" r="1" />
                  </svg>
                </span>
                {movie.genres}
              </div>
            )}
          </div>
        </div>

        {isComingSoon && movie.releaseDate && (
          <div className="mv-card__release">
            Khởi chiếu: {formatDate(movie.releaseDate)}
          </div>
        )}
      </div>

      <h3 className="mv-card__title">{movie.title}</h3>

      <div className="mv-card__actions">
        {isComingSoon ? (
          <Link href={`/movie/${movie.id}`} className="mv-card__btn mv-card__btn--outline">
            Chi tiết
          </Link>
        ) : (
          <Link href={`/movie/${movie.id}`} className="mv-card__btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 9a3 3 0 013-3h14a3 3 0 013 3v9a3 3 0 01-3 3H5a3 3 0 01-3-3V9z" />
              <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
            </svg>
            Mua vé
          </Link>
        )}

        {movie.trailer && (
          <a
            href={movie.trailer}
            target="_blank"
            rel="noopener noreferrer"
            className="mv-card__trailer"
          >
            <span className="mv-card__trailer-icon">▶</span>
            Trailer
          </a>
        )}
      </div>
    </div>
  );
}
