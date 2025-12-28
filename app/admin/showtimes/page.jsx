"use client";
import { useState, useEffect } from "react";

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowtimes();
  }, []);

  const fetchShowtimes = async () => {
    try {
      const res = await fetch("/api/showtimes");
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

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2>Quản lý suất chiếu</h2>
        <button className="admin-chip">+ Thêm suất chiếu</button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Phim</th>
                <th>Rạp</th>
                <th>Phòng</th>
                <th>Ngày</th>
                <th>Giờ chiếu</th>
                <th>Giá vé</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-table-empty">
                    Chưa có suất chiếu nào
                  </td>
                </tr>
              ) : (
                showtimes.map((st) => (
                  <tr key={st.id}>
                    <td>
                      <strong>{st.movie.title}</strong>
                    </td>
                    <td>{st.branch_name}</td>
                    <td>{st.screen_name}</td>
                    <td>{formatDate(st.start_time)}</td>
                    <td>
                      <strong style={{ color: "var(--accent)" }}>{formatTime(st.start_time)}</strong>
                    </td>
                    <td>{formatCurrency(st.base_price)}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-chip">Sửa</button>
                        <button className="admin-chip admin-chip--danger">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
