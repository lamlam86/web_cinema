"use client";
import { useState, useEffect } from "react";

export default function AdminCinemasPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      if (data.branches) {
        setBranches(data.branches);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2>Quản lý hệ thống rạp</h2>
        <button className="admin-chip">+ Thêm rạp</button>
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
                <th>ID</th>
                <th>Tên rạp</th>
                <th>Địa chỉ</th>
                <th>Thành phố</th>
                <th>Hotline</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-table-empty">
                    Chưa có rạp nào
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.id}>
                    <td>{branch.id}</td>
                    <td>
                      <strong>{branch.name}</strong>
                    </td>
                    <td>{branch.address}</td>
                    <td>{branch.city}</td>
                    <td>{branch.hotline || "-"}</td>
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
