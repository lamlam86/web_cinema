"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

function ScheduleContent() {
  const searchParams = useSearchParams();

  const [showtimes, setShowtimes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    generateDates();
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchShowtimes();
    }
  }, [selectedDate, selectedBranch]);

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

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      if (data.branches) {
        setBranches(data.branches);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchShowtimes = async () => {
    setLoading(true);
    try {
      const dateStr = `${selectedDate.getDate().toString().padStart(2, "0")}/${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}/${selectedDate.getFullYear()}`;
      const url = `/api/showtimes?date=${dateStr}${selectedBranch !== "all" ? `&branch=${selectedBranch}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.showtimes) {
        setShowtimes(data.showtimes);
      }
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    } finally {
      setLoading(false);
    }
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

  // Group showtimes by movie
  const showtimesByMovie = showtimes.reduce((acc, st) => {
    const movieId = st.movie.id;
    if (!acc[movieId]) {
      acc[movieId] = { movie: st.movie, showtimes: [] };
    }
    acc[movieId].showtimes.push(st);
    return acc;
  }, {});

  return (
    <div className="app">
      <Header />
      <main>
        <div className="container">
          <section className="section">
            <h1 className="section-heading">Lịch chiếu phim</h1>

            {/* Filters */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="admin-input"
                style={{ maxWidth: "300px" }}
              >
                <option value="all">Tất cả rạp</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "8px" }}>
              {dates.map((date, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className="btn-viewmore"
                  style={{
                    background: selectedDate?.getDate() === date.getDate() ? "var(--primary)" : "rgba(255,255,255,0.05)",
                    borderColor: selectedDate?.getDate() === date.getDate() ? "var(--primary)" : "var(--border)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <div className="loading-spinner" />
              </div>
            ) : Object.keys(showtimesByMovie).length > 0 ? (
              <div style={{ display: "grid", gap: "24px" }}>
                {Object.values(showtimesByMovie).map(({ movie, showtimes: sts }) => (
                  <div
                    key={movie.id}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: "20px",
                      display: "flex",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    {movie.poster_url && (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        style={{ width: "120px", borderRadius: "8px", flexShrink: 0 }}
                      />
                    )}

                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <Link href={`/movie/${movie.id}`}>
                        <h3 style={{ margin: "0 0 8px" }}>{movie.title}</h3>
                      </Link>

                      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                        {movie.duration_minutes && <span>{movie.duration_minutes} phút</span>}
                        {movie.genres && <span>{movie.genres}</span>}
                        {movie.rating && <span className={`mv-card__badge mv-card__badge--age ${movie.rating}`}>{movie.rating}</span>}
                      </div>

                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {sts.map((st) => (
                          <Link
                            key={st.id}
                            href={`/checkout?showtime=${st.id}`}
                            className="btn-viewmore"
                            style={{ flexShrink: 0 }}
                          >
                            <span style={{ fontWeight: 700 }}>{formatTime(st.start_time)}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-soft)", marginLeft: "6px" }}>
                              {st.branch_name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Không có suất chiếu nào cho ngày này</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="loading-state"><div className="loading-spinner" /></div>}>
      <ScheduleContent />
    </Suspense>
  );
}
