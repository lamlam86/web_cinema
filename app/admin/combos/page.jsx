"use client";
import { useState, useEffect } from "react";

export default function AdminCombosPage() {
  const [concessions, setConcessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConcessions();
  }, []);

  const fetchConcessions = async () => {
    try {
      const res = await fetch("/api/concessions");
      const data = await res.json();
      if (data.concessions) {
        setConcessions(data.concessions);
      }
    } catch (error) {
      console.error("Error fetching concessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const getTypeLabel = (type) => {
    const labels = {
      combo: "Combo",
      popcorn: "Bắp rang",
      drink: "Đồ uống",
      snack: "Snacks",
    };
    return labels[type] || type;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2>Quản lý bắp nước</h2>
        <button className="admin-chip">+ Thêm sản phẩm</button>
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
                <th>Sản phẩm</th>
                <th>Loại</th>
                <th>Giá</th>
                <th>Mô tả</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {concessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              ) : (
                concessions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                          />
                        )}
                        <strong>{item.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-badge--active">{getTypeLabel(item.type)}</span>
                    </td>
                    <td style={{ color: "var(--accent)", fontWeight: 600 }}>{formatCurrency(item.price)}</td>
                    <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.description || "-"}
                    </td>
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
