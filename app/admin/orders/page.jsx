"use client";
import { useState, useEffect } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusLabel = (status) => {
    const labels = {
      reserved: "Đã đặt",
      confirmed: "Đã xác nhận",
      cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  const getPaymentLabel = (status) => {
    const labels = {
      pending: "Chờ thanh toán",
      paid: "Đã thanh toán",
      refunded: "Đã hoàn tiền",
      failed: "Thất bại",
    };
    return labels[status] || status;
  };

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Quản lý đơn đặt vé</h2>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đặt vé</th>
                <th>Phim</th>
                <th>Ghế</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-table-empty">
                    Chưa có đơn đặt vé nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong style={{ color: "var(--primary-light)" }}>{order.booking_code}</strong>
                    </td>
                    <td>{order.movie}</td>
                    <td>{order.seats?.join(", ")}</td>
                    <td>{formatCurrency(order.total_amount)}</td>
                    <td>
                      <span className={`status-badge status-badge--${order.status}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${order.payment_status}`}>
                        {getPaymentLabel(order.payment_status)}
                      </span>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
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
