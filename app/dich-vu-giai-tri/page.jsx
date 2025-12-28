import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EntertainmentPage() {
  return (
    <div className="app">
      <Header />
      <main>
        <div className="container">
          <section className="section">
            <h1 className="section-heading">Dịch vụ giải trí</h1>

            <div className="branches-grid">
              <div className="branch-card">
                <div className="branch-card__icon" style={{ background: "rgba(34, 211, 238, 0.15)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  </svg>
                </div>
                <h3 className="branch-card__name">Phòng chiếu VIP</h3>
                <p className="branch-card__address">
                  Trải nghiệm xem phim riêng tư với ghế sofa cao cấp, dịch vụ phục vụ tận nơi và không gian sang trọng.
                </p>
              </div>

              <div className="branch-card">
                <div className="branch-card__icon" style={{ background: "rgba(244, 114, 182, 0.15)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2">
                    <path d="M18 8h1a4 4 0 010 8h-1" />
                    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                </div>
                <h3 className="branch-card__name">Bắp nước & Snacks</h3>
                <p className="branch-card__address">
                  Đa dạng combo bắp nước, snacks, đồ uống với giá ưu đãi khi đặt kèm vé xem phim.
                </p>
              </div>

              <div className="branch-card">
                <div className="branch-card__icon" style={{ background: "rgba(251, 191, 36, 0.15)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className="branch-card__name">Đặt vé online</h3>
                <p className="branch-card__address">
                  Đặt vé dễ dàng qua website hoặc app, chọn ghế yêu thích và thanh toán nhanh chóng.
                </p>
              </div>

              <div className="branch-card">
                <div className="branch-card__icon" style={{ background: "rgba(52, 211, 153, 0.15)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <h3 className="branch-card__name">Thành viên VIP</h3>
                <p className="branch-card__address">
                  Tích điểm đổi quà, giảm giá đặc biệt và nhiều ưu đãi dành riêng cho thành viên.
                </p>
              </div>

              <div className="branch-card">
                <div className="branch-card__icon" style={{ background: "rgba(139, 92, 246, 0.15)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 className="branch-card__name">Suất chiếu đặc biệt</h3>
                <p className="branch-card__address">
                  Premiere, suất chiếu sớm, phim bom tấn - trải nghiệm đầu tiên cùng LMK Cinema.
                </p>
              </div>

              <div className="branch-card">
                <div className="branch-card__icon" style={{ background: "rgba(251, 113, 133, 0.15)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h3 className="branch-card__name">E-Ticket</h3>
                <p className="branch-card__address">
                  Vé điện tử gửi qua email, chỉ cần quét QR code tại rạp - nhanh chóng, tiện lợi.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
