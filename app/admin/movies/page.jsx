"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    poster: "",
    backdrop: "",
    trailer: "",
    synopsis: "",
    genres: "",
    language: "",
    country: "",
    director: "",
    cast: "",
    duration: "",
    rating: "",
    releaseDate: "",
    status: "draft",
    isFeatured: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();
      if (data.data) {
        setMovies(data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const url = editingId ? `/api/movies/${editingId}` : "/api/movies";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration) || 0,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessage({ type: "error", text: data.error });
      } else {
        setMessage({ type: "success", text: editingId ? "Cập nhật thành công!" : "Thêm phim thành công!" });
        fetchMovies();
        resetForm();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (movie) => {
    setFormData({
      title: movie.title || "",
      poster: movie.poster || "",
      backdrop: movie.backdrop || "",
      trailer: movie.trailer || "",
      synopsis: movie.synopsis || "",
      genres: movie.genres || "",
      language: movie.language || "",
      country: movie.country || "",
      director: movie.director || "",
      cast: movie.cast || "",
      duration: movie.duration?.toString() || "",
      rating: movie.rating || "",
      releaseDate: movie.releaseDate || "",
      status: movie.status || "draft",
      isFeatured: movie.isFeatured || false,
    });
    setEditingId(movie.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa phim này?")) return;

    try {
      const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "Xóa phim thành công!" });
        fetchMovies();
      } else {
        setMessage({ type: "error", text: data.error || "Không thể xóa phim" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      poster: "",
      backdrop: "",
      trailer: "",
      synopsis: "",
      genres: "",
      language: "",
      country: "",
      director: "",
      cast: "",
      duration: "",
      rating: "",
      releaseDate: "",
      status: "draft",
      isFeatured: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusLabel = (status) => {
    const labels = {
      now_showing: "Đang chiếu",
      coming_soon: "Sắp chiếu",
      draft: "Nháp",
      archived: "Lưu trữ",
    };
    return labels[status] || status;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2>Quản lý phim</h2>
        <button className="admin-chip" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Đóng" : "+ Thêm phim"}
        </button>
      </div>

      {message.text && (
        <div className={`admin-alert admin-alert--${message.type}`}>{message.text}</div>
      )}

      {showForm && (
        <div className="admin-form" style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>{editingId ? "Sửa phim" : "Thêm phim mới"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Tiêu đề *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="admin-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Poster URL *</label>
                <input
                  type="url"
                  name="poster"
                  value={formData.poster}
                  onChange={handleChange}
                  className="admin-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Backdrop URL</label>
                <input
                  type="url"
                  name="backdrop"
                  value={formData.backdrop}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Trailer URL</label>
                <input
                  type="url"
                  name="trailer"
                  value={formData.trailer}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Thể loại *</label>
                <input
                  type="text"
                  name="genres"
                  value={formData.genres}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="Hành động, Phiêu lưu"
                  required
                />
              </div>
              <div className="form-group">
                <label>Thời lượng (phút) *</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="admin-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Ngôn ngữ</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Quốc gia</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Đạo diễn</label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Diễn viên</label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Phân loại tuổi</label>
                <select name="rating" value={formData.rating} onChange={handleChange} className="admin-input">
                  <option value="">Chọn</option>
                  <option value="P">P - Phổ thông</option>
                  <option value="T13">T13 - 13 tuổi</option>
                  <option value="T16">T16 - 16 tuổi</option>
                  <option value="T18">T18 - 18 tuổi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ngày phát hành *</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="admin-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="admin-input" required>
                  <option value="draft">Nháp</option>
                  <option value="now_showing">Đang chiếu</option>
                  <option value="coming_soon">Sắp chiếu</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label>Mô tả *</label>
              <textarea
                name="synopsis"
                value={formData.synopsis}
                onChange={handleChange}
                className="admin-input"
                rows={4}
                style={{ borderRadius: "var(--radius-sm)" }}
                required
              />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
              Phim nổi bật (hiển thị banner)
            </label>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button type="submit" className="admin-submit-btn" disabled={saving} style={{ flex: 1 }}>
                {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm phim"}
              </button>
              <button type="button" className="admin-chip" onClick={resetForm}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Phim</th>
                <th>Thể loại</th>
                <th>Thời lượng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {movies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    Chưa có phim nào
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {movie.poster && (
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            style={{ width: "40px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                          />
                        )}
                        <div>
                          <strong>{movie.title}</strong>
                          {movie.isFeatured && (
                            <span style={{ marginLeft: "8px", fontSize: "0.75rem", color: "var(--warning)" }}>⭐</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{movie.genres}</td>
                    <td>{movie.duration} phút</td>
                    <td>
                      <span className={`status-badge status-badge--${movie.status}`}>{getStatusLabel(movie.status)}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-chip" onClick={() => handleEdit(movie)}>
                          Sửa
                        </button>
                        <button className="admin-chip admin-chip--danger" onClick={() => handleDelete(movie.id)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
