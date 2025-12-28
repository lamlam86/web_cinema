"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      setError("Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="login-container">
        <div className="login-box">
          <h2>Quên mật khẩu</h2>

          {success ? (
            <div>
              <div className="login-notice">
                Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu trong vài phút.
              </div>
              <Link href="/login" className="btn-login" style={{ display: "flex", marginTop: "16px" }}>
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <>
              <p style={{ marginBottom: "20px", color: "var(--text-muted)" }}>
                Nhập email của bạn để nhận link đặt lại mật khẩu.
              </p>

              {error && <div className="general-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                  />
                </div>

                <button type="submit" className="btn-login" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                </button>
              </form>

              <p className="register-text">
                <Link href="/login">← Quay lại đăng nhập</Link>
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
