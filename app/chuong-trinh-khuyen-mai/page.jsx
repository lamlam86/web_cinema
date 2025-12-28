"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PromotionsPage() {
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
      return `Giảm ${promo.discount_value}%`;
    }
    return `Giảm ${new Intl.NumberFormat("vi-VN").format(promo.discount_value)}đ`;
  };

  return (
    <div className="app">
      <Header />
      <main>
        <div className="container">
          <section className="section">
            <h1 className="section-heading">Chương trình khuyến mãi</h1>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <div className="loading-spinner" />
              </div>
            ) : promotions.length > 0 ? (
              <div className="branches-grid">
                {promotions.map((promo) => (
                  <div key={promo.id} className="branch-card">
                    <div
                      className="branch-card__icon"
                      style={{ background: "rgba(251, 191, 36, 0.15)" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                    </div>
                    <h3 className="branch-card__name">{promo.name}</h3>
                    {promo.description && (
                      <p className="branch-card__address">{promo.description}</p>
                    )}
                    <p style={{ margin: "12px 0 6px", fontSize: "1.1rem", fontWeight: 700, color: "var(--warning)" }}>
                      {formatDiscount(promo)}
                    </p>
                    {promo.code && (
                      <p style={{ margin: 0, fontSize: "0.9rem" }}>
                        Mã: <strong style={{ color: "var(--primary-light)" }}>{promo.code}</strong>
                      </p>
                    )}
                    <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "var(--text-soft)" }}>
                      HSD: {formatDate(promo.end_date)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Hiện chưa có chương trình khuyến mãi nào</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
