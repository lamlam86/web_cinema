"use client";
import { useState, useEffect } from "react";

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await fetch("/api/promotions");
      const data = await res.json();
      if (data.promotions) {
        setPromotions(data.promotions);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không giới hạn";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const formatDiscount = (promo) => {
    if (promo.discount_type === "percent") {
      return `${promo.discount_value}%`;
    }
    return new Intl.NumberFormat("vi-VN").format(promo.discount_value) + "đ";
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2>Quản lý khuyến mãi</h2>
        <button className="admin-chip">+ Thêm khuyến mãi</button>
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
                <th>Tên chương trình</th>
                <th>Mã giảm giá</th>
                <th>Giảm giá</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-table-empty">
                    Chưa có khuyến mãi nào
                  </td>
                </tr>
              ) : (
                promotions.map((promo) => (
                  <tr key={promo.id}>
                    <td>
                      <strong>{promo.name}</strong>
                    </td>
                    <td>
                      {promo.code ? (
                        <span style={{ color: "var(--primary-light)", fontWeight: 600 }}>{promo.code}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td style={{ color: "var(--warning)", fontWeight: 600 }}>{formatDiscount(promo)}</td>
                    <td>{formatDate(promo.start_date)}</td>
                    <td>{formatDate(promo.end_date)}</td>
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
