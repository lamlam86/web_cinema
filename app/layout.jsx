import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata = {
  title: "LMK Cinema - Đặt vé xem phim online",
  description: "Hệ thống rạp phim LMK Cinema - Đặt vé xem phim nhanh chóng và tiện lợi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
