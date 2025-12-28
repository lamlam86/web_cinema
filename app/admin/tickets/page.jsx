"use client";
import { useState, useEffect } from "react";

const STATUS_LABELS = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
  completed: "Hoàn thành"
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", movie_id: "", date: "" });
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  async function fetchMovies() {
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();
      setMovies(data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchTickets() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.movie_id) params.append("movie_id", filters.movie_id);
      if (filters.date) params.append("date", filters.date);
      
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setTickets(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(ticketId, newStatus) {
    try {
      const res = await fetch(`/api/admin/orders/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: newStatus })
      });
      if (!res.ok) throw new Error();
      fetchTickets();
    } catch (err) {
      alert("Không thể cập nhật trạng thái.");
    }
  }

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.payment_status === "pending").length,
    paid: tickets.filter(t => t.payment_status === "paid").length,
    cancelled: tickets.filter(t => t.payment_status === "cancelled").length,
    totalRevenue: tickets.filter(t => t.payment_status === "paid").reduce((sum, t) => sum + t.total_amount, 0)
  };

  return (
    <div className="admin-stack">
      <div className="page-heading">
        <div>
          <p className="admin-eyebrow">Vận hành</p>
          <h2>Quản lý Vé</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters" style={{gap: 16}}>
        <select
          className="admin-input"
          style={{width: "auto", minWidth: 200}}
          value={filters.status}
          onChange={e => setFilters({...filters, status: e.target.value})}
        >
          <option value="">-- Tất cả trạng thái --</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          className="admin-input"
          style={{width: "auto", minWidth: 200}}
          value={filters.movie_id}
          onChange={e => setFilters({...filters, movie_id: e.target.value})}
        >
          <option value="">-- Tất cả phim --</option>
          {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <input
          type="date"
          className="admin-input"
          style={{width: "auto"}}
          value={filters.date}
          onChange={e => setFilters({...filters, date: e.target.value})}
        />
      </div>

      {/* Stats */}
      <section className="dashboard-kpi-grid">
        <article className="dashboard-card kpi">
          <p>Tổng vé</p>
          <strong>{stats.total}</strong>
          <span>Theo bộ lọc</span>
        </article>
        <article className="dashboard-card kpi">
          <p>Chờ thanh toán</p>
          <strong>{stats.pending}</strong>
          <span>Đang chờ</span>
        </article>
        <article className="dashboard-card kpi">
          <p>Đã thanh toán</p>
          <strong>{stats.paid}</strong>
          <span>Hoàn thành</span>
        </article>
        <article className="dashboard-card kpi">
          <p>Doanh thu</p>
          <strong>{stats.totalRevenue.toLocaleString()}đ</strong>
          <span>Tổng tiền</span>
        </article>
      </section>

      {/* Table */}
      {loading ? (
        <div className="admin-loading">Đang tải...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã vé</th>
                <th>Khách hàng</th>
                <th>Phim</th>
                <th>Rạp / Phòng</th>
                <th>Thời gian</th>
                <th>Ghế</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr><td colSpan="9" className="admin-empty">Không có vé nào</td></tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td><strong>{ticket.booking_code}</strong></td>
                    <td>
                      <div>
                        <strong>{ticket.user?.name || "Khách vãng lai"}</strong>
                        <div style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>{ticket.user?.email || ""}</div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-user-cell">
                        {ticket.movie_poster && (
                          <img src={ticket.movie_poster} alt="" style={{width: 40, height: 56, borderRadius: 4, objectFit: "cover"}} />
                        )}
                        <div>
                          <strong>{ticket.movie}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{ticket.branch}</strong>
                        <div style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>{ticket.screen}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{new Date(ticket.showtime).toLocaleTimeString("vi-VN", {hour: "2-digit", minute: "2-digit"})}</strong>
                        <div style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>
                          {new Date(ticket.showtime).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{display: "flex", flexWrap: "wrap", gap: 4}}>
                        {ticket.seats.map((seat, idx) => (
                          <span key={idx} style={{padding: "2px 6px", background: "#f0f4ff", borderRadius: 4, fontSize: "0.8rem"}}>
                            {seat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td><strong>{ticket.total_amount.toLocaleString()}đ</strong></td>
                    <td>
                      <select
                        className="admin-input admin-input--dense"
                        value={ticket.payment_status}
                        onChange={e => updateStatus(ticket.id, e.target.value)}
                      >
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-action-btn"
                          onClick={() => window.open(`/my-tickets?code=${ticket.booking_code}`, "_blank")}
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
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











