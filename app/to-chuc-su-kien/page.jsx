import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EventsPage() {
  return (
    <div className="app">
      <Header />
      <main>
        <div className="container">
          <section className="section">
            <h1 className="section-heading">Tổ chức sự kiện</h1>

            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "32px",
                marginBottom: "24px",
              }}
            >
              <h2 style={{ fontSize: "1.3rem", marginBottom: "16px", color: "var(--primary-light)" }}>
                🎉 Dịch vụ tổ chức sự kiện tại LMK Cinema
              </h2>

              <p style={{ lineHeight: 1.8, marginBottom: "20px" }}>
                LMK Cinema cung cấp dịch vụ cho thuê phòng chiếu phim để tổ chức các sự kiện đặc biệt như sinh nhật, tiệc công ty, ra mắt sản phẩm, hội thảo và nhiều loại hình sự kiện khác.
              </p>

              <div className="branches-grid" style={{ marginTop: "24px" }}>
                <div className="branch-card">
                  <h3 className="branch-card__name">🎂 Tiệc sinh nhật</h3>
                  <p className="branch-card__address">
                    Tổ chức sinh nhật độc đáo trong không gian rạp chiếu phim, kết hợp xem phim yêu thích cùng bạn bè và gia đình.
                  </p>
                </div>

                <div className="branch-card">
                  <h3 className="branch-card__name">🏢 Sự kiện công ty</h3>
                  <p className="branch-card__address">
                    Team building, tiệc cuối năm, ra mắt sản phẩm - không gian rạp phim sẽ tạo nên sự kiện đáng nhớ.
                  </p>
                </div>

                <div className="branch-card">
                  <h3 className="branch-card__name">🎮 Gaming & eSports</h3>
                  <p className="branch-card__address">
                    Màn hình lớn, âm thanh sống động - lý tưởng cho các giải đấu game, xem trực tiếp eSports.
                  </p>
                </div>

                <div className="branch-card">
                  <h3 className="branch-card__name">💒 Private Screening</h3>
                  <p className="branch-card__address">
                    Đặt suất chiếu riêng cho nhóm nhỏ, hẹn hò lãng mạn hoặc kỷ niệm đặc biệt.
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(34, 211, 238, 0.1))",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "var(--radius-lg)",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <h3 style={{ marginBottom: "16px" }}>📞 Liên hệ đặt sự kiện</h3>
              <p style={{ fontSize: "1.1rem", marginBottom: "8px" }}>
                Hotline: <strong style={{ color: "var(--accent)" }}>1900 123 456</strong>
              </p>
              <p style={{ marginBottom: "16px" }}>
                Email: <strong style={{ color: "var(--primary-light)" }}>events@lmkcinema.com</strong>
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Đội ngũ tư vấn của chúng tôi sẵn sàng hỗ trợ bạn 24/7
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
