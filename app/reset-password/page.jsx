"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
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

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu mới";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formData.password }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setGeneralError(data.message || "Đặt lại mật khẩu thất bại");
      }
    } catch (error) {
      setGeneralError("Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-box">
        <h2>Lỗi</h2>
        <div className="general-error">Link đặt lại mật khẩu không hợp lệ</div>
        <Link href="/forgot-password" className="btn-login" style={{ display: "flex", marginTop: "16px" }}>
          Yêu cầu link mới
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="login-box">
        <h2>Thành công!</h2>
        <div className="login-notice">Mật khẩu của bạn đã được đặt lại thành công.</div>
        <Link href="/login" className="btn-login" style={{ display: "flex", marginTop: "16px" }}>
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="login-box">
      <h2>Đặt lại mật khẩu</h2>

      {generalError && <div className="general-error">{generalError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu mới</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu mới"
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu mới"
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
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
          <ResetPasswordContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
