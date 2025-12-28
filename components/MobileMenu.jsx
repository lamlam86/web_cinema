"use client";
import Link from "next/link";

export default function MobileMenu({ user, onClose, onLogout }) {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="mnav">
      <div className="mnav__backdrop" onClick={onClose} />
      <div className="mnav__sheet">
        <button className="mnav__close" onClick={onClose}>✕</button>
        
        <nav className="mnav__list">
          <Link href="/movie" onClick={onClose}>Đặt vé xem phim</Link>
          <Link href="/popcorn-drink" onClick={onClose}>Bắp nước</Link>
          <Link href="/lich-chieu" onClick={onClose}>Lịch chiếu</Link>
          <Link href="/he-thong-rap" onClick={onClose}>Hệ thống rạp</Link>
          <Link href="/chuong-trinh-khuyen-mai" onClick={onClose}>Khuyến mãi</Link>
          <Link href="/gioi-thieu" onClick={onClose}>Giới thiệu</Link>
          <Link href="/dich-vu-giai-tri" onClick={onClose}>Dịch vụ giải trí</Link>
          <Link href="/to-chuc-su-kien" onClick={onClose}>Tổ chức sự kiện</Link>
        </nav>

        {user ? (
          <div className="mnav__auth">
            <Link href="/profile" onClick={onClose}>Tài khoản</Link>
            <button onClick={handleLogout} style={{ background: "rgba(251, 113, 133, 0.1)", borderColor: "var(--danger)", color: "var(--danger)" }}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="mnav__auth">
            <Link href="/login" onClick={onClose}>Đăng nhập</Link>
            <Link href="/signup" onClick={onClose}>Đăng ký</Link>
          </div>
        )}
      </div>
    </div>
  );
}
