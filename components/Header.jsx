"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const { totalItems, toggleCart } = useCart();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Fetch user error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setShowDropdown(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const isAdmin = user?.roles?.includes("admin");
  const isStaff = user?.roles?.includes("staff");
  const getInitials = (name) => name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <>
      <header className="header">
        <div className="header__container">
          <nav className="header__navbar">
            <Link href="/" className="header__logo">
              <img src="/assets/images/logo.png" alt="LMK Cinema" />
            </Link>

            <div className="header__cta">
              <Link href="/movie" className="btn-cta btn-cta--solid">
                <img src="/assets/images/ic-ticket.svg" alt="" className="icon" />
                <span>Đặt vé ngay</span>
              </Link>
              <Link href="/popcorn-drink" className="btn-cta btn-cta--ghost">
                <img src="/assets/images/ic-cor.svg" alt="" className="icon" />
                <span>Bắp nước</span>
              </Link>
            </div>

            <div className="header__right">
              <form className="header__search" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="header__search-input"
                  placeholder="Tìm phim, rạp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="header__search-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              </form>

              <button className="header__cart-btn" onClick={toggleCart}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {totalItems > 0 && <span className="header__cart-badge">{totalItems}</span>}
              </button>

              {loading ? (
                <div className="header__auth-loading" />
              ) : user ? (
                <>
                  {(isAdmin || isStaff) && (
                    <Link href="/admin" className="btn-admin-panel">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                      </svg>
                      <span>Admin</span>
                    </Link>
                  )}
                  <div className="header__user" ref={dropdownRef}>
                    <button className="header__user-btn" onClick={() => setShowDropdown(!showDropdown)}>
                      <div className="header__user-avatar header__user-avatar--initials">
                        {getInitials(user.fullName)}
                      </div>
                      <span className="header__user-name">{user.fullName}</span>
                      <svg className={`header__user-chevron ${showDropdown ? "open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {showDropdown && (
                      <div className="header__dropdown">
                        <div className="header__dropdown-header">
                          <p className="header__dropdown-name">{user.fullName}</p>
                          <p className="header__dropdown-email">{user.email}</p>
                        </div>
                        <Link href="/profile" className="header__dropdown-item" onClick={() => setShowDropdown(false)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          </svg>
                          Tài khoản
                        </Link>
                        <Link href="/my-tickets" className="header__dropdown-item" onClick={() => setShowDropdown(false)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 9a3 3 0 013-3h14a3 3 0 013 3v9a3 3 0 01-3 3H5a3 3 0 01-3-3V9z" />
                            <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
                          </svg>
                          Vé của tôi
                        </Link>
                        <div className="header__dropdown-divider" />
                        <button className="header__dropdown-item header__dropdown-item--logout" onClick={handleLogout}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link href="/login" className="btn-cta btn-cta--ghost">
                  Đăng nhập
                </Link>
              )}

              <button className="header__hamburger" onClick={() => setShowMobileMenu(true)}>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </nav>
        </div>

        <div className="header__subnav">
          <div className="header__subnav-inner">
            <ul className="header__subnav-list">
              <li><Link href="/lich-chieu" className="header__subnav-link">Lịch chiếu</Link></li>
              <li><Link href="/he-thong-rap" className="header__subnav-link">Hệ thống rạp</Link></li>
              <li><Link href="/chuong-trinh-khuyen-mai" className="header__subnav-link">Khuyến mãi</Link></li>
              <li><Link href="/gioi-thieu" className="header__subnav-link">Giới thiệu</Link></li>
              <li><Link href="/dich-vu-giai-tri" className="header__subnav-link">Dịch vụ giải trí</Link></li>
              <li><Link href="/to-chuc-su-kien" className="header__subnav-link">Tổ chức sự kiện</Link></li>
            </ul>
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <MobileMenu user={user} onClose={() => setShowMobileMenu(false)} onLogout={handleLogout} />
      )}
    </>
  );
}
