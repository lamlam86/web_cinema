"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.success) {
        router.push("/login?redirect=/admin");
        return;
      }

      const isAdmin = data.user.roles?.includes("admin");
      const isStaff = data.user.roles?.includes("staff");

      if (!isAdmin && !isStaff) {
        router.push("/");
        return;
      }

      setUser(data.user);
    } catch (error) {
      router.push("/login?redirect=/admin");
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

  if (!user) {
    return null;
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
