"use client";
import { useState, useEffect } from "react";

export default function AdminAdminsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users?role=admin");
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2>Quản trị viên</h2>
        <button className="admin-chip">+ Thêm Admin</button>
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
                <th>Họ tên</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    Chưa có quản trị viên nào
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.fullName}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-badge status-badge--${user.status}`}>
                        {user.status === "active" ? "Hoạt động" : "Khóa"}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-chip">Sửa</button>
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
