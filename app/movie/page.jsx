"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import CartDrawer from "@/components/CartDrawer";

function MoviePageContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(statusFilter);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    setActiveTab(statusFilter);
  }, [statusFilter]);

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();
      if (data.data) {
        setMovies(data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter((m) => {
    if (activeTab === "all") return m.status === "now_showing" || m.status === "coming_soon";
    return m.status === activeTab;
  });

  return (
    <div className="app">
      <Header />
      <CartDrawer />

      <main>
        <div className="container">
          <section className="section">
            <h1 className="section-heading">Phim</h1>

            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              <button
                className={`btn-viewmore ${activeTab === "all" ? "" : ""}`}
                onClick={() => setActiveTab("all")}
                style={{
                  background: activeTab === "all" ? "var(--primary)" : "rgba(255,255,255,0.05)",
                  borderColor: activeTab === "all" ? "var(--primary)" : "var(--border)",
                }}
              >
                Tất cả
              </button>
              <button
                className="btn-viewmore"
                onClick={() => setActiveTab("now_showing")}
                style={{
                  background: activeTab === "now_showing" ? "var(--primary)" : "rgba(255,255,255,0.05)",
                  borderColor: activeTab === "now_showing" ? "var(--primary)" : "var(--border)",
                }}
              >
                Đang chiếu
              </button>
              <button
                className="btn-viewmore"
                onClick={() => setActiveTab("coming_soon")}
                style={{
                  background: activeTab === "coming_soon" ? "var(--primary)" : "rgba(255,255,255,0.05)",
                  borderColor: activeTab === "coming_soon" ? "var(--primary)" : "var(--border)",
                }}
              >
                Sắp chiếu
              </button>
            </div>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <div className="loading-spinner" />
              </div>
            ) : filteredMovies.length > 0 ? (
              <div className="mv-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} variant={movie.status} />
                ))}
              </div>
            ) : (
              <p className="empty-message">Không có phim nào</p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function MoviePage() {
  return (
    <Suspense fallback={<div className="loading-state"><div className="loading-spinner" /></div>}>
      <MoviePageContent />
    </Suspense>
  );
}
