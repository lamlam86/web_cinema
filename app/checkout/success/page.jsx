"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingCode = searchParams.get("code");

  return (
    <div className="app">
      <Header />
      <main className="login-container">
        <div
          className="login-box"
          style={{ textAlign: "center" }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 20px",
              borderRadius: "50%",
              background: "rgba(52, 211, 153, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 style={{ color: "var(--success)", marginBottom: "16px" }}>Đặt vé thành công!</h2>

          <p style={{ marginBottom: "20px" }}>
            Mã đặt vé của bạn: <br />
            <strong style={{ fontSize: "1.5rem", color: "var(--primary-light)" }}>{bookingCode}</strong>
          </p>

          <p style={{ fontSize: "0.9rem", marginBottom: "24px", color: "var(--text-muted)" }}>
            Vui lòng xuất trình mã này hoặc QR code tại quầy để nhận vé. Chúng tôi đã gửi thông tin chi tiết vào email của bạn.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/my-tickets" className="btn-login" style={{ flex: 1, maxWidth: "200px" }}>
              Xem vé của tôi
            </Link>
            <Link href="/" className="btn-viewmore" style={{ flex: 1, maxWidth: "200px" }}>
              Trang chủ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="loading-state"><div className="loading-spinner" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
