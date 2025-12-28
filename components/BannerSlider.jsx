"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BannerSlider() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedMovies();
  }, []);

  const fetchFeaturedMovies = async () => {
    try {
      const res = await fetch("/api/movies/featured");
      const data = await res.json();
      if (data.data) {
        setMovies(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching featured movies:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="banner-wrap">
        <div className="banner-loading">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="banner-wrap">
        <div className="banner-slide">
          <div className="banner-placeholder">
            <span>🎬</span>
            <h2>LMK Cinema</h2>
            <p>Trải nghiệm điện ảnh đỉnh cao</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="banner-wrap">
      <Swiper
        className="banner-swiper"
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={movies.length > 1}
        slidesPerView={1}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="banner-slide">
              <Link href={`/movie/${movie.id}`} className="banner-link">
                {movie.backdrop || movie.poster ? (
                  <img
                    src={movie.backdrop || movie.poster}
                    alt={movie.title}
                    className="banner-img"
                  />
                ) : (
                  <div className="banner-placeholder">
                    <span>🎬</span>
                    <h2>{movie.title}</h2>
                  </div>
                )}
                <div className="banner-overlay">
                  <h2 className="banner-title">{movie.title}</h2>
                  <span className="banner-cta">Xem chi tiết →</span>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
