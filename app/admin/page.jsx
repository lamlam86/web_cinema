"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    movies: 0,
    bookings: 0,
    users: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const moviesRes = await fetch("/api/movies");
      const moviesData = await moviesRes.json();

      setStats({
        movies: moviesData.data?.length || 0,
        bookings: 0,
        users: 0,
        revenue: 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Dashboard</h2>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <p className="admin-stat-label">Tổng phim</p>
              <h3 className="admin-stat-value" style={{ color: "var(--primary-light)" }}>
                {stats.movies}
              </h3>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Đơn đặt vé</p>
              <h3 className="admin-stat-value" style={{ color: "var(--accent)" }}>
                {stats.bookings}
              </h3>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Khách hàng</p>
              <h3 className="admin-stat-value" style={{ color: "var(--success)" }}>
                {stats.users}
              </h3>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Doanh thu</p>
              <h3 className="admin-stat-value" style={{ color: "var(--warning)", fontSize: "1.4rem" }}>
                {formatCurrency(stats.revenue)}
              </h3>
            </div>
          </div>

          <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            <Link
              href="/admin/movies"
              className="branch-card"
              style={{ textDecoration: "none" }}
            >
              <h3 style={{ marginBottom: "8px" }}>🎬 Quản lý phim</h3>
              <p style={{ color: "var(--text-muted)" }}>Thêm, sửa, xóa phim trong hệ thống</p>
            </Link>

            <Link
              href="/admin/showtimes"
              className="branch-card"
              style={{ textDecoration: "none" }}
            >
              <h3 style={{ marginBottom: "8px" }}>🕐 Suất chiếu</h3>
              <p style={{ color: "var(--text-muted)" }}>Quản lý lịch chiếu phim</p>
            </Link>

            <Link
              href="/admin/orders"
              className="branch-card"
              style={{ textDecoration: "none" }}
            >
              <h3 style={{ marginBottom: "8px" }}>🎫 Đơn đặt vé</h3>
              <p style={{ color: "var(--text-muted)" }}>Xem và quản lý các đơn đặt vé</p>
            </Link>

            <Link
              href="/admin/promotions"
              className="branch-card"
              style={{ textDecoration: "none" }}
            >
              <h3 style={{ marginBottom: "8px" }}>🎁 Khuyến mãi</h3>
              <p style={{ color: "var(--text-muted)" }}>Quản lý chương trình khuyến mãi</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
