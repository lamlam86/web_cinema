"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

export default function PopcornDrinkPage() {
  const [concessions, setConcessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchConcessions = async () => {
      try {
        const res = await fetch("/api/concessions");
        const data = await res.json();
        if (data.success) {
          setConcessions(data.concessions || []);
        }
      } catch (error) {
        console.error("Failed to fetch concessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConcessions();
  }, []);

  const handleQuantityChange = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const handleAddToCart = () => {
    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = concessions.find(c => c.id === Number(id));
        return { ...item, quantity: qty };
      });

    if (items.length > 0) {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      addToCart({
        type: "concession",
        items,
        total,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      });
      setQuantities({});
    }
  };

  const total = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const item = concessions.find(c => c.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div className="app">
      <Header />
      <main className="container" style={{ padding: "2rem 1rem", minHeight: "60vh" }}>
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Bắp & Nước</h1>
        
        {loading ? (
          <p style={{ textAlign: "center" }}>Đang tải...</p>
        ) : concessions.length === 0 ? (
          <p style={{ textAlign: "center" }}>Chưa có sản phẩm</p>
        ) : (
          <>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
              gap: "1.5rem",
              marginBottom: "2rem"
            }}>
              {concessions.map((item) => (
                <div key={item.id} style={{ 
                  background: "#1a1a2e", 
                  borderRadius: "12px", 
                  overflow: "hidden",
                  border: "1px solid #333"
                }}>
                  {item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      style={{ width: "100%", height: "180px", objectFit: "cover" }}
                    />
                  )}
                  <div style={{ padding: "1rem" }}>
                    <h3 style={{ marginBottom: "0.5rem" }}>{item.name}</h3>
                    <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                      {item.description}
                    </p>
                    <p style={{ color: "#f5a623", fontWeight: "bold", marginBottom: "1rem" }}>
                      {item.price?.toLocaleString("vi-VN")}đ
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <button 
                        onClick={() => handleQuantityChange(item.id, -1)}
                        style={{ 
                          width: "32px", 
                          height: "32px", 
                          borderRadius: "50%",
                          border: "1px solid #f5a623",
                          background: "transparent",
                          color: "#f5a623",
                          cursor: "pointer"
                        }}
                      >
                        -
                      </button>
                      <span>{quantities[item.id] || 0}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, 1)}
                        style={{ 
                          width: "32px", 
                          height: "32px", 
                          borderRadius: "50%",
                          border: "1px solid #f5a623",
                          background: "#f5a623",
                          color: "#000",
                          cursor: "pointer"
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {total > 0 && (
              <div style={{ 
                position: "fixed", 
                bottom: 0, 
                left: 0, 
                right: 0, 
                background: "#1a1a2e",
                padding: "1rem",
                borderTop: "1px solid #333",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>Tổng: <strong style={{ color: "#f5a623" }}>{total.toLocaleString("vi-VN")}đ</strong></span>
                <button 
                  onClick={handleAddToCart}
                  className="btn-primary"
                >
                  Thêm vào giỏ
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
