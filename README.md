# LMK Cinema - Movie Booking System

Hệ thống đặt vé xem phim online với Next.js 15, Prisma và MySQL.

## 🚀 Tính năng

### Người dùng
- ✅ Đăng ký / Đăng nhập / Quên mật khẩu
- ✅ Xem danh sách phim (đang chiếu / sắp chiếu)
- ✅ Xem chi tiết phim và trailer
- ✅ Xem lịch chiếu theo ngày và rạp
- ✅ Chọn ghế và đặt vé
- ✅ Xem vé đã đặt
- ✅ Quản lý tài khoản

### Admin
- ✅ Dashboard tổng quan
- ✅ Quản lý phim (CRUD)
- ✅ Quản lý suất chiếu
- ✅ Quản lý hệ thống rạp
- ✅ Quản lý đơn đặt vé
- ✅ Quản lý bắp nước
- ✅ Quản lý khuyến mãi
- ✅ Quản lý khách hàng
- ✅ Quản lý nhân viên

## 🛠 Công nghệ

- **Frontend:** Next.js 15, React 18
- **Styling:** CSS thuần (không Tailwind)
- **Database:** MySQL với Prisma ORM
- **Authentication:** JWT + Cookies
- **Email:** Nodemailer
- **QR Code:** qrcode package

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone <repo-url>
cd lmk-cinema
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa các biến môi trường trong `.env`:
- `DATABASE_URL`: Connection string MySQL
- `JWT_SECRET`: Secret key cho JWT
- Các biến SMTP nếu cần gửi email

### 4. Setup Database

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed data (optional)
npm run db:seed
```

### 5. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📁 Cấu trúc thư mục

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication APIs
│   │   ├── movies/        # Movies APIs
│   │   ├── bookings/      # Bookings APIs
│   │   └── ...
│   ├── checkout/          # Checkout pages
│   ├── movie/             # Movie pages
│   ├── globals.css        # Global styles
│   └── layout.jsx         # Root layout
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── MovieCard.jsx
│   └── ...
├── contexts/              # React contexts
├── lib/                   # Utility libraries
│   ├── auth.js           # Authentication helpers
│   ├── email.js          # Email helpers
│   └── prisma.js         # Prisma client
├── prisma/               # Prisma schema & migrations
├── public/               # Static files
└── package.json
```

## 🔑 Tài khoản mặc định

Sau khi seed database:

- **Admin:** admin@lmkcinema.com / Admin@123
- **Staff:** staff@lmkcinema.com / Staff@123
- **Customer:** customer@lmkcinema.com / Customer@123

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/profile` - Cập nhật profile
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

### Movies
- `GET /api/movies` - Danh sách phim
- `GET /api/movies/:id` - Chi tiết phim
- `GET /api/movies/featured` - Phim nổi bật
- `POST /api/movies` - Thêm phim (Admin)
- `PUT /api/movies/:id` - Sửa phim (Admin)
- `DELETE /api/movies/:id` - Xóa phim (Admin)

### Showtimes
- `GET /api/showtimes` - Danh sách suất chiếu
- `GET /api/showtimes/:id/seats` - Sơ đồ ghế

### Bookings
- `GET /api/bookings` - Danh sách đặt vé của user
- `POST /api/bookings` - Tạo đặt vé mới

### Others
- `GET /api/branches` - Danh sách rạp
- `GET /api/concessions` - Danh sách bắp nước
- `GET /api/promotions` - Danh sách khuyến mãi
- `GET /api/search` - Tìm kiếm

## 📝 License

MIT License

## 👨‍💻 Author

LMK Cinema Team
