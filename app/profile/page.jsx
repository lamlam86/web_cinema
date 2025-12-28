"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setFormData((prev) => ({
          ...prev,
          fullName: data.user.fullName || "",
          phone: data.user.phone || "",
        }));
      } else {
        router.push("/login?redirect=/profile");
      }
    } catch (error) {
      router.push("/login?redirect=/profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      } else {
        setMessage({ type: "error", text: data.message || "Có lỗi xảy ra" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="login-container">
          <div className="loading-spinner" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="login-container">
        <div className="login-box" style={{ maxWidth: "560px" }}>
          <h2>Thông tin tài khoản</h2>

          {message.text && (
            <div className={message.type === "error" ? "general-error" : "login-notice"}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user?.email || ""} disabled style={{ opacity: 0.7 }} />
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" }} />
            <h3 style={{ fontSize: "1rem", marginBottom: "16px" }}>Đổi mật khẩu</h3>

            <div className="form-group">
              <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <button type="submit" className="btn-login" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
