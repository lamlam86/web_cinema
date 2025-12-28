"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      if (data.branches) {
        setBranches(data.branches);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <main>
        <div className="container">
          <section className="section">
            <h1 className="section-heading">Hệ thống rạp LMK Cinema</h1>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <div className="loading-spinner" />
              </div>
            ) : branches.length > 0 ? (
              <div className="branches-grid">
                {branches.map((branch) => (
                  <div key={branch.id} className="branch-card">
                    <div className="branch-card__icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <h3 className="branch-card__name">{branch.name}</h3>
                    <p className="branch-card__address">{branch.address}</p>
                    <p className="branch-card__city">{branch.city}</p>
                    {branch.hotline && (
                      <a href={`tel:${branch.hotline}`} className="branch-card__hotline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        {branch.hotline}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Đang cập nhật thông tin hệ thống rạp...</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
