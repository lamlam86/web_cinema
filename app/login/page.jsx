"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, rememberMe }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        setGeneralError(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setGeneralError("Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-box">
      <h2>Đăng nhập tài khoản</h2>

      {searchParams.get("registered") && (
        <div className="login-notice">Đăng ký thành công! Vui lòng đăng nhập.</div>
      )}

      {generalError && <div className="general-error">{generalError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email của bạn"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Ghi nhớ đăng nhập
          </label>
          <Link href="/forgot-password" className="forgot-password">
            Quên mật khẩu?
          </Link>
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      <p className="register-text">
        Chưa có tài khoản? <Link href="/signup">Đăng ký ngay</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="login-container">
        <Suspense
          fallback={
            <div className="login-box">
              <h2>Đang tải...</h2>
            </div>
          }
        >
          <LoginContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
