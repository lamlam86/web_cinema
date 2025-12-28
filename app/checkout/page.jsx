"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showtimeId = searchParams.get("showtime");

  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showtimeId) {
      fetchSeats();
    }
  }, [showtimeId]);

  const fetchSeats = async () => {
    try {
      const res = await fetch(`/api/showtimes/${showtimeId}/seats`);
      const data = await res.json();
      if (data.showtime) {
        setShowtime(data.showtime);
        setSeats(data.seats);
      } else {
        setError("Không tìm thấy suất chiếu");
      }
    } catch (error) {
      setError("Lỗi khi tải thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      if (prev.length >= 8) {
        return prev;
      }
      return [...prev, seat];
    });
  };

  const handleSubmit = async () => {
    if (selectedSeats.length === 0) {
      setError("Vui lòng chọn ít nhất 1 ghế");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtime_id: showtimeId,
          seats: selectedSeats.map((s) => ({ seat_id: s.id, price: s.price })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/checkout/success?code=${data.booking.booking_code}`);
      } else {
        setError(data.error || "Đặt vé thất bại");
      }
    } catch (error) {
      setError("Đã có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="login-container">
          <div className="loading-spinner" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!showtime || error === "Không tìm thấy suất chiếu") {
    return (
      <div className="app">
        <Header />
        <main>
          <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
            <h2>Không tìm thấy suất chiếu</h2>
            <a href="/lich-chieu" className="btn-viewmore" style={{ display: "inline-flex", marginTop: "20px" }}>
              Xem lịch chiếu
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main>
        <div className="container">
          <section className="section">
            {/* Movie Info */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                marginBottom: "24px",
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              {showtime.movie.poster_url && (
                <img
                  src={showtime.movie.poster_url}
                  alt={showtime.movie.title}
                  style={{ width: "100px", borderRadius: "8px", flexShrink: 0 }}
                />
              )}
              <div>
                <h2 style={{ margin: "0 0 12px" }}>{showtime.movie.title}</h2>
                <p style={{ margin: "0 0 6px", color: "var(--text-muted)" }}>
                  📍 {showtime.branch.name} - {showtime.screen.name}
                </p>
                <p style={{ margin: "0 0 6px", color: "var(--text-muted)" }}>📅 {formatDate(showtime.start_time)}</p>
                <p style={{ margin: "0", color: "var(--accent)", fontWeight: 600 }}>
                  🕐 {formatTime(showtime.start_time)}
                </p>
              </div>
            </div>

            {/* Seat Selection */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Chọn ghế</h3>

              {/* Screen */}
              <div
                style={{
                  width: "80%",
                  maxWidth: "400px",
                  margin: "0 auto 32px",
                  height: "8px",
                  background: "linear-gradient(to right, transparent, var(--primary), transparent)",
                  borderRadius: "4px",
                }}
              />
              <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-soft)", marginBottom: "24px" }}>
                MÀN HÌNH
              </p>

              {/* Seats */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                {Object.entries(seats)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([row, rowSeats]) => (
                    <div key={row} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <span style={{ width: "24px", fontWeight: 600, color: "var(--text-soft)" }}>{row}</span>
                      {rowSeats.map((seat) => {
                        const isSelected = selectedSeats.find((s) => s.id === seat.id);
                        return (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.isBooked}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "6px",
                              border: "1px solid",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              cursor: seat.isBooked ? "not-allowed" : "pointer",
                              background: seat.isBooked
                                ? "var(--border)"
                                : isSelected
                                ? "var(--primary)"
                                : seat.type === "vip"
                                ? "rgba(251, 191, 36, 0.2)"
                                : "rgba(255,255,255,0.05)",
                              borderColor: seat.isBooked
                                ? "transparent"
                                : isSelected
                                ? "var(--primary)"
                                : seat.type === "vip"
                                ? "rgba(251, 191, 36, 0.5)"
                                : "var(--border)",
                              color: seat.isBooked ? "var(--text-soft)" : isSelected ? "#fff" : "var(--text-primary)",
                            }}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>
                  ))}
              </div>

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "24px",
                  marginTop: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
                  <div style={{ width: "20px", height: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "4px" }} />
                  <span>Trống</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
                  <div style={{ width: "20px", height: "20px", background: "var(--primary)", borderRadius: "4px" }} />
                  <span>Đang chọn</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
                  <div style={{ width: "20px", height: "20px", background: "var(--border)", borderRadius: "4px" }} />
                  <span>Đã đặt</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
                  <div style={{ width: "20px", height: "20px", background: "rgba(251, 191, 36, 0.2)", border: "1px solid rgba(251, 191, 36, 0.5)", borderRadius: "4px" }} />
                  <span>VIP</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
              }}
            >
              {error && <div className="general-error" style={{ marginBottom: "16px" }}>{error}</div>}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span>Ghế đã chọn:</span>
                <span style={{ fontWeight: 600 }}>
                  {selectedSeats.length > 0 ? selectedSeats.map((s) => s.code).join(", ") : "Chưa chọn ghế"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span>Tổng tiền:</span>
                <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--accent)" }}>
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <button
                className="btn-login"
                onClick={handleSubmit}
                disabled={submitting || selectedSeats.length === 0}
              >
                {submitting ? "Đang xử lý..." : "Đặt vé"}
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="loading-state"><div className="loading-spinner" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
