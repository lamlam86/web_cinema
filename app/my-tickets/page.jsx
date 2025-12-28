"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MyTicketsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.error === "Chưa đăng nhập") {
        router.push("/login?redirect=/my-tickets");
        return;
      }
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (status === "cancelled") return { text: "Đã hủy", class: "status-badge--cancelled" };
    if (paymentStatus === "paid") return { text: "Đã thanh toán", class: "status-badge--paid" };
    if (paymentStatus === "pending") return { text: "Chờ thanh toán", class: "status-badge--pending" };
    return { text: status, class: "status-badge--draft" };
  };

  return (
    <div className="app">
      <Header />
      <main>
        <div className="container">
          <section className="section">
            <h1 className="section-heading">Vé của tôi</h1>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <div className="loading-spinner" />
              </div>
            ) : bookings.length > 0 ? (
              <div style={{ display: "grid", gap: "20px" }}>
                {bookings.map((booking) => {
                  const statusBadge = getStatusBadge(booking.status, booking.payment_status);
                  return (
                    <div
                      key={booking.id}
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
                      {booking.poster && (
                        <img
                          src={booking.poster}
                          alt={booking.movie}
                          style={{ width: "100px", borderRadius: "8px", flexShrink: 0 }}
                        />
                      )}

                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                          <h3 style={{ margin: 0 }}>{booking.movie}</h3>
                          <span className={`status-badge ${statusBadge.class}`}>{statusBadge.text}</span>
                        </div>

                        <div style={{ display: "grid", gap: "6px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                          <p style={{ margin: 0 }}>📍 {booking.branch} - {booking.screen}</p>
                          <p style={{ margin: 0 }}>📅 {formatDate(booking.showtime)}</p>
                          <p style={{ margin: 0 }}>🕐 {formatTime(booking.showtime)}</p>
                          <p style={{ margin: 0 }}>💺 Ghế: {booking.seats.join(", ")}</p>
                          <p style={{ margin: 0 }}>🎫 Mã vé: <strong style={{ color: "var(--primary-light)" }}>{booking.booking_code}</strong></p>
                        </div>

                        <div style={{ marginTop: "12px", fontSize: "1.1rem", fontWeight: "700", color: "var(--accent)" }}>
                          {formatCurrency(booking.total_amount)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="empty-message">Bạn chưa có vé nào. <a href="/movie" style={{ color: "var(--primary-light)" }}>Đặt vé ngay!</a></p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
