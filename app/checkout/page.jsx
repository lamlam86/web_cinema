"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          router.push("/login?redirect=/checkout");
        }
      } catch {
        router.push("/login?redirect=/checkout");
      }
    };
    fetchUser();
  }, [router]);

  if (cart.length === 0) {
    return (
      <div className="app">
        <Header />
        <main className="container" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h2>Giỏ hàng trống</h2>
            <p>Vui lòng chọn vé hoặc sản phẩm trước khi thanh toán.</p>
            <button onClick={() => router.push("/movie")} className="btn-primary" style={{ marginTop: "1rem" }}>
              Xem phim
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="container" style={{ padding: "2rem 1rem", minHeight: "60vh" }}>
        <h1 style={{ marginBottom: "2rem" }}>Thanh toán</h1>
        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr 400px" }}>
          <div>
            <h3>Chi tiết đơn hàng</h3>
            {cart.map((item, index) => (
              <div key={index} style={{ padding: "1rem", borderBottom: "1px solid #333" }}>
                {item.type === "ticket" && (
                  <>
                    <p><strong>{item.movie?.title}</strong></p>
                    <p>Ghế: {item.seats?.join(", ")}</p>
                    <p>Suất chiếu: {new Date(item.showtime?.start_time).toLocaleString("vi-VN")}</p>
                  </>
                )}
                {item.type === "concession" && (
                  <p><strong>Combo bắp nước</strong></p>
                )}
              </div>
            ))}
          </div>
          <div style={{ background: "#1a1a2e", padding: "1.5rem", borderRadius: "8px" }}>
            <h3>Tổng cộng</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f5a623" }}>
              {getCartTotal().toLocaleString("vi-VN")}đ
            </p>
            <button 
              className="btn-primary" 
              style={{ width: "100%", marginTop: "1rem" }}
              disabled={loading}
              onClick={() => {
                setLoading(true);
                // TODO: Implement payment
                alert("Tính năng thanh toán đang được phát triển");
                setLoading(false);
              }}
            >
              {loading ? "Đang xử lý..." : "Thanh toán"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
