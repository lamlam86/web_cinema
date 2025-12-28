"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerSlider from "@/components/BannerSlider";
import MovieCard from "@/components/MovieCard";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";

export default function HomePage() {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesRes, branchesRes] = await Promise.all([
        fetch("/api/movies"),
        fetch("/api/branches"),
      ]);

      const moviesData = await moviesRes.json();
      const branchesData = await branchesRes.json();

      if (moviesData.data) {
        setNowShowing(moviesData.data.filter((m) => m.status === "now_showing").slice(0, 8));
        setComingSoon(moviesData.data.filter((m) => m.status === "coming_soon").slice(0, 8));
      }

      if (branchesData.branches) {
        setBranches(branchesData.branches);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <CartDrawer />

      <main>
        <div className="container">
          <BannerSlider />

          <section className="section">
            <div className="section-header">
              <h2 className="section-heading">Phim đang chiếu</h2>
              <Link href="/movie?status=now_showing" className="section-link">
                Xem tất cả →
              </Link>
            </div>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <div className="loading-spinner" />
              </div>
            ) : nowShowing.length > 0 ? (
              <div className="mv-grid">
                {nowShowing.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} variant="now_showing" />
                ))}
              </div>
            ) : (
              <p className="empty-message">Chưa có phim đang chiếu</p>
            )}
          </section>

          <section className="section">
            <div className="section-header">
              <h2 className="section-heading">Phim sắp chiếu</h2>
              <Link href="/movie?status=coming_soon" className="section-link">
                Xem tất cả →
              </Link>
            </div>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <div className="loading-spinner" />
              </div>
            ) : comingSoon.length > 0 ? (
              <div className="mv-grid">
                {comingSoon.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} variant="coming_soon" />
                ))}
              </div>
            ) : (
              <p className="empty-message">Chưa có phim sắp chiếu</p>
            )}
          </section>

          <section className="section">
            <div className="section-header">
              <h2 className="section-heading">Hệ thống rạp</h2>
              <Link href="/he-thong-rap" className="section-link">
                Xem tất cả →
              </Link>
            </div>

            {branches.length > 0 ? (
              <div className="branches-grid">
                {branches.slice(0, 6).map((branch) => (
                  <div key={branch.id} className="branch-card">
                    <div className="branch-card__icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <h3 className="branch-card__name">{branch.name}</h3>
                    <p className="branch-card__address">{branch.address}</p>
                    <p className="branch-card__city">{branch.city}</p>
                    {branch.hotline && (
                      <a href={`tel:${branch.hotline}`} className="branch-card__hotline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        {branch.hotline}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Đang tải thông tin rạp...</p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
