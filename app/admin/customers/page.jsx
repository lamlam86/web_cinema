"use client";
import { useState, useEffect } from "react";

export default function AdminCustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users?role=customer");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Quản lý khách hàng</h2>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Điểm</th>
                <th>Trạng thái</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-table-empty">
                    Chưa có khách hàng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.fullName}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    <td style={{ color: "var(--warning)" }}>{user.points}</td>
                    <td>
                      <span className={`status-badge status-badge--${user.status}`}>
                        {user.status === "active" ? "Hoạt động" : "Khóa"}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-chip">Chi tiết</button>
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
