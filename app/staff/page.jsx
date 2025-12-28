"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StaffPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin");
  }, [router]);

  return (
    <div className="admin-loading-screen">
      <div className="admin-loading-spinner" />
      <p>Đang chuyển hướng...</p>
    </div>
  );
}
