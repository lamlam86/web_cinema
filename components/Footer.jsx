"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col footer-col--brand">
              <div className="footer-logo-text">
                <span className="footer-logo-lmk">LMK</span>
                <span className="footer-logo-cinema">CINEMA</span>
              </div>
              <p className="footer-slogan">Trải nghiệm điện ảnh đỉnh cao</p>
              <div className="footer-cta-btns">
                <Link href="/movie" className="footer-cta-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 9a3 3 0 013-3h14a3 3 0 013 3v9a3 3 0 01-3 3H5a3 3 0 01-3-3V9z" />
                    <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
                  </svg>
                  Đặt vé ngay
                </Link>
                <Link href="/popcorn-drink" className="footer-cta-btn footer-cta-btn--outline">
                  Bắp nước
                </Link>
              </div>
              <div className="footer-social-icons">
                <a href="#" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="#" aria-label="Youtube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 6.5a3 3 0 00-2.1-2.1C19 4 12 4 12 4s-7 0-8.9.4A3 3 0 001 6.5 31 31 0 000 12a31 31 0 001 5.5 3 3 0 002.1 2.1c1.9.4 8.9.4 8.9.4s7 0 8.9-.4a3 3 0 002.1-2.1 31 31 0 001-5.5 31 31 0 00-1-5.5z" />
                    <polygon points="10 15.5 16 12 10 8.5" fill="var(--background)" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>VỀ CHÚNG TÔI</h4>
              <Link href="/gioi-thieu">Giới thiệu</Link>
              <Link href="/he-thong-rap">Hệ thống rạp</Link>
              <Link href="/lien-he">Liên hệ</Link>
              <Link href="/tuyen-dung">Tuyển dụng</Link>
            </div>

            <div className="footer-col">
              <h4>DỊCH VỤ</h4>
              <Link href="/movie">Đặt vé xem phim</Link>
              <Link href="/popcorn-drink">Bắp nước</Link>
              <Link href="/to-chuc-su-kien">Tổ chức sự kiện</Link>
              <Link href="/chuong-trinh-khuyen-mai">Khuyến mãi</Link>
            </div>

            <div className="footer-col">
              <h4>HỖ TRỢ</h4>
              <Link href="/faq">FAQ</Link>
              <Link href="/huong-dan-dat-ve">Hướng dẫn đặt vé</Link>
              <Link href="/chinh-sach">Chính sách</Link>
            </div>

            <div className="footer-col">
              <h4>LIÊN HỆ</h4>
              <a href="tel:1900123456">Hotline: 1900 123 456</a>
              <a href="mailto:support@lmkcinema.com">support@lmkcinema.com</a>
            </div>

            <div className="footer-col">
              <h4>HỆ THỐNG RẠP</h4>
              <Link href="/he-thong-rap">LMK Quận 1 <span className="footer-branch-city">HCM</span></Link>
              <Link href="/he-thong-rap">LMK Quận 7 <span className="footer-branch-city">HCM</span></Link>
              <Link href="/he-thong-rap">LMK Hà Nội <span className="footer-branch-city">HN</span></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p>© 2024 LMK Cinema. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link href="/dieu-khoan">Điều khoản sử dụng</Link>
              <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            </div>
          </div>
          <div className="footer-legal">
            <p><strong>CÔNG TY TNHH LMK CINEMA</strong></p>
            <p>Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
