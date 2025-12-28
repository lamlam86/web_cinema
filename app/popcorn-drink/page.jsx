"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/contexts/CartContext";

export default function ConcessionPage() {
  const [concessions, setConcessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { addItem } = useCart();

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const filteredItems = activeTab === "all" ? concessions : concessions.filter((c) => c.type === activeTab);

  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "combo", label: "Combo" },
    { key: "popcorn", label: "Bắp rang" },
    { key: "drink", label: "Đồ uống" },
    { key: "snack", label: "Snacks" },
  ];

  const handleAddToCart = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image_url,
      type: "concession",
    });
  };

  return (
    <div className="app">
      <Header />
      <CartDrawer />
      <main>
        <div className="container">
          <section className="section">
            <h1 className="section-heading">Bắp nước & Snacks</h1>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "8px" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="btn-viewmore"
                  style={{
                    background: activeTab === tab.key ? "var(--primary)" : "rgba(255,255,255,0.05)",
                    borderColor: activeTab === tab.key ? "var(--primary)" : "var(--border)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <div className="loading-spinner" />
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="branches-grid">
                {filteredItems.map((item) => (
                  <div key={item.id} className="branch-card">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "var(--radius-sm)",
                          marginBottom: "12px",
                        }}
                      />
                    )}
                    <h3 className="branch-card__name">{item.name}</h3>
                    {item.description && <p className="branch-card__address">{item.description}</p>}
                    <p style={{ margin: "12px 0", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)" }}>
                      {formatCurrency(item.price)}
                    </p>
                    <button className="btn-viewmore" style={{ width: "100%" }} onClick={() => handleAddToCart(item)}>
                      Thêm vào giỏ
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Không có sản phẩm nào</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
