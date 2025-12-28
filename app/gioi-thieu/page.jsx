import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="app">
      <Header />
      <main>
        <div className="container">
          <section className="section">
            <h1 className="section-heading">Giới thiệu về LMK Cinema</h1>

            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "32px",
                lineHeight: 1.8,
              }}
            >
              <h2 style={{ fontSize: "1.3rem", marginBottom: "16px", color: "var(--primary-light)" }}>
                Trải nghiệm điện ảnh đỉnh cao
              </h2>

              <p style={{ marginBottom: "16px" }}>
                <strong>LMK Cinema</strong> là hệ thống rạp chiếu phim hiện đại, mang đến cho khán giả những trải nghiệm điện ảnh tuyệt vời nhất với công nghệ tiên tiến và dịch vụ chuyên nghiệp.
              </p>

              <h3 style={{ fontSize: "1.1rem", margin: "24px 0 12px" }}>🎬 Công nghệ hiện đại</h3>
              <p style={{ marginBottom: "16px" }}>
                Hệ thống âm thanh Dolby Atmos, màn hình LED 4K sắc nét, ghế ngồi êm ái thoải mái giúp bạn đắm chìm hoàn toàn vào thế giới phim ảnh.
              </p>

              <h3 style={{ fontSize: "1.1rem", margin: "24px 0 12px" }}>🍿 Dịch vụ đa dạng</h3>
              <p style={{ marginBottom: "16px" }}>
                Bắp nước ngon, combo hấp dẫn, cùng với dịch vụ đặt vé online tiện lợi - tất cả để bạn có buổi xem phim hoàn hảo nhất.
              </p>

              <h3 style={{ fontSize: "1.1rem", margin: "24px 0 12px" }}>📍 Hệ thống rạp rộng khắp</h3>
              <p style={{ marginBottom: "16px" }}>
                Với nhiều chi nhánh tại các thành phố lớn, LMK Cinema luôn sẵn sàng phục vụ bạn mọi lúc, mọi nơi.
              </p>

              <h3 style={{ fontSize: "1.1rem", margin: "24px 0 12px" }}>💜 Cam kết của chúng tôi</h3>
              <ul style={{ paddingLeft: "20px", color: "var(--text-muted)" }}>
                <li>Chất lượng phục vụ tốt nhất</li>
                <li>Giá vé hợp lý</li>
                <li>Nhiều chương trình ưu đãi hấp dẫn</li>
                <li>Không gian rạp sạch đẹp, thoáng mát</li>
              </ul>

              <div style={{ marginTop: "32px", padding: "20px", background: "rgba(139, 92, 246, 0.1)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                  🎥 Đặt vé ngay hôm nay và trải nghiệm điện ảnh cùng LMK Cinema!
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
