"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";

export default function MovieDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    fetchMovie();
    generateDates();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const res = await fetch(`/api/movies/${id}`);
      const data = await res.json();
      if (data.data) {
        setMovie(data.data);
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateDates = () => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    setDates(arr);
    setSelectedDate(arr[0]);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const filteredShowtimes =
    movie?.showtimes?.filter((st) => {
      if (!selectedDate) return true;
      const showDate = new Date(st.startTime);
      return (
        showDate.getDate() === selectedDate.getDate() &&
        showDate.getMonth() === selectedDate.getMonth() &&
        showDate.getFullYear() === selectedDate.getFullYear()
      );
    }) || [];

  // Group showtimes by branch
  const showtimesByBranch = filteredShowtimes.reduce((acc, st) => {
    const branchId = st.branch?.id || "unknown";
    if (!acc[branchId]) {
      acc[branchId] = { branch: st.branch, showtimes: [] };
    }
    acc[branchId].showtimes.push(st);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main>
          <div className="container" style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
            <div className="loading-spinner" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="app">
        <Header />
        <main>
          <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
            <h2>Không tìm thấy phim</h2>
            <Link href="/movie" className="btn-viewmore" style={{ marginTop: "20px", display: "inline-flex" }}>
              Quay lại danh sách phim
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <CartDrawer />

      <main>
        {/* Hero Section */}
        <div
          className="bk-hero"
          style={{
            background: movie.backdrop
              ? `linear-gradient(to bottom, rgba(5,1,14,0.7), rgba(5,1,14,0.95)), url(${movie.backdrop}) center/cover`
              : "linear-gradient(135deg, var(--background-alt), var(--background))",
            padding: "40px 0",
          }}
        >
          <div className="container">
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              <div style={{ flexShrink: 0, width: "280px" }}>
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{ width: "100%", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow)" }}
                  />
                ) : (
                  <div className="mv-card__no-poster" style={{ aspectRatio: "2/3" }}>
                    <span>Chưa có poster</span>
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: "280px" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>{movie.title}</h1>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {movie.rating && (
                    <span className={`mv-card__badge mv-card__badge--age ${movie.rating}`}>{movie.rating}</span>
                  )}
                  {movie.duration > 0 && (
                    <span className="mv-card__badge mv-card__badge--2d">{movie.duration} phút</span>
                  )}
                </div>

                <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
                  {movie.genres && (
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: "var(--text-primary)" }}>Thể loại:</strong> {movie.genres}
                    </p>
                  )}
                  {movie.director && (
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: "var(--text-primary)" }}>Đạo diễn:</strong> {movie.director}
                    </p>
                  )}
                  {movie.cast && (
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: "var(--text-primary)" }}>Diễn viên:</strong> {movie.cast}
                    </p>
                  )}
                  {movie.language && (
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: "var(--text-primary)" }}>Ngôn ngữ:</strong> {movie.language}
                    </p>
                  )}
                  {movie.releaseDate && (
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: "var(--text-primary)" }}>Khởi chiếu:</strong> {movie.releaseDate}
                    </p>
                  )}
                </div>

                {movie.synopsis && <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>{movie.synopsis}</p>}

                {movie.trailer && (
                  <a
                    href={movie.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-viewmore"
                    style={{ marginTop: "20px", display: "inline-flex" }}
                  >
                    ▶ Xem Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes Section */}
        {movie.status === "now_showing" && (
          <div className="container">
            <section className="section">
              <h2 className="section-heading">Lịch chiếu</h2>

              {/* Date Selector */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "8px" }}>
                {dates.map((date, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className="btn-viewmore"
                    style={{
                      background:
                        selectedDate?.getDate() === date.getDate() ? "var(--primary)" : "rgba(255,255,255,0.05)",
                      borderColor: selectedDate?.getDate() === date.getDate() ? "var(--primary)" : "var(--border)",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>

              {Object.keys(showtimesByBranch).length > 0 ? (
                <div style={{ display: "grid", gap: "20px" }}>
                  {Object.values(showtimesByBranch).map(({ branch, showtimes }) => (
                    <div
                      key={branch?.id || "unknown"}
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        padding: "20px",
                      }}
                    >
                      <h3 style={{ marginBottom: "12px" }}>{branch?.name || "Rạp"}</h3>
                      <p style={{ fontSize: "0.9rem", marginBottom: "16px", color: "var(--text-muted)" }}>
                        {branch?.address}
                      </p>

                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {showtimes.map((st) => (
                          <Link
                            key={st.id}
                            href={`/checkout?showtime=${st.id}`}
                            className="btn-viewmore"
                            style={{ flexShrink: 0 }}
                          >
                            <span style={{ fontWeight: 700 }}>{formatTime(st.startTime)}</span>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "8px" }}>
                              {formatCurrency(st.basePrice)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">Chưa có suất chiếu cho ngày này</p>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
