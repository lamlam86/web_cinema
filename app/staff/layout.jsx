"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.success) {
        router.push("/login?redirect=/staff");
        return;
      }

      const isStaff = data.user.roles?.includes("staff") || data.user.roles?.includes("admin");

      if (!isStaff) {
        router.push("/");
        return;
      }
    } catch (error) {
      router.push("/login?redirect=/staff");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <p>Đang tải...</p>
      </div>
    );
  }

  return <>{children}</>;
}
