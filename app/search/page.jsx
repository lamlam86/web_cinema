"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState({ movies: [], branches: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length >= 2) {
      searchData();
    }
  }, [query]);

  const searchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
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
            <h1 className="section-heading">Kết quả tìm kiếm: &quot;{query}&quot;</h1>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <div className="loading-spinner" />
              </div>
            ) : (
              <>
                {results.movies.length > 0 && (
                  <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Phim ({results.movies.length})</h2>
                    <div className="mv-grid">
                      {results.movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} variant={movie.status} />
                      ))}
                    </div>
                  </div>
                )}

                {results.branches.length > 0 && (
                  <div>
                    <h2 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Rạp ({results.branches.length})</h2>
                    <div className="branches-grid">
                      {results.branches.map((branch) => (
                        <Link key={branch.id} href="/he-thong-rap" className="branch-card">
                          <h3 className="branch-card__name">{branch.name}</h3>
                          <p className="branch-card__address">{branch.address}</p>
                          <p className="branch-card__city">{branch.city}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results.movies.length === 0 && results.branches.length === 0 && query.trim().length >= 2 && (
                  <p className="empty-message">Không tìm thấy kết quả nào cho &quot;{query}&quot;</p>
                )}

                {query.trim().length < 2 && <p className="empty-message">Vui lòng nhập ít nhất 2 ký tự để tìm kiếm</p>}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loading-state"><div className="loading-spinner" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
