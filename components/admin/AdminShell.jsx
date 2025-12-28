"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/movies", label: "Quản lý phim", icon: "🎬" },
  { href: "/admin/showtimes", label: "Suất chiếu", icon: "🕐" },
  { href: "/admin/cinemas", label: "Hệ thống rạp", icon: "🏢" },
  { href: "/admin/orders", label: "Đơn đặt vé", icon: "🎫" },
  { href: "/admin/combos", label: "Bắp nước", icon: "🍿" },
  { href: "/admin/promotions", label: "Khuyến mãi", icon: "🎁" },
  { href: "/admin/customers", label: "Khách hàng", icon: "👥" },
  { href: "/admin/staff", label: "Nhân viên", icon: "👔" },
];

export default function AdminShell({ user, children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const isAdmin = user?.roles?.includes("admin");

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link href="/">
            <h2 className="admin-brand__title">LMK Cinema</h2>
          </Link>
          <small>Admin Panel</small>
        </div>

        <nav className="admin-nav-group">
          <p className="admin-nav-group__title">Menu</p>
          <ul className="admin-nav-group__list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`admin-nav-link ${pathname === item.href ? "is-active" : ""}`}
                >
                  <span>
                    {item.icon} {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {isAdmin && (
          <nav className="admin-nav-group">
            <p className="admin-nav-group__title">Hệ thống</p>
            <ul className="admin-nav-group__list">
              <li>
                <Link
                  href="/admin/admins"
                  className={`admin-nav-link ${pathname === "/admin/admins" ? "is-active" : ""}`}
                >
                  <span>🔐 Quản trị viên</span>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </aside>

      <main className="admin-content">
        <header className="admin-content__header">
          <div>
            <p className="admin-eyebrow">Admin Panel</p>
            <h1>LMK Cinema</h1>
          </div>

          <div className="admin-header-user">
            <div className="admin-user-avatar">{getInitials(user?.fullName)}</div>
            <div>
              <p className="admin-user-name">{user?.fullName}</p>
              <span className={`admin-role-badge admin-role-badge--${isAdmin ? "admin" : "staff"}`}>
                {isAdmin ? "Admin" : "Staff"}
              </span>
            </div>
            <button className="admin-logout-btn" onClick={handleLogout} title="Đăng xuất">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </header>

        <div className="admin-content__body">{children}</div>
      </main>
    </div>
  );
}
