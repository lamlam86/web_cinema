import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create roles
  const adminRole = await prisma.roles.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin", description: "Quản trị viên hệ thống" },
  });

  const staffRole = await prisma.roles.upsert({
    where: { name: "staff" },
    update: {},
    create: { name: "staff", description: "Nhân viên" },
  });

  const customerRole = await prisma.roles.upsert({
    where: { name: "customer" },
    update: {},
    create: { name: "customer", description: "Khách hàng" },
  });

  console.log("✅ Roles created");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.users.upsert({
    where: { email: "admin@lmkcinema.com" },
    update: {},
    create: {
      full_name: "Admin LMK",
      email: "admin@lmkcinema.com",
      password_hash: adminPassword,
      phone: "0901234567",
      status: "active",
      user_roles: {
        create: { role_id: adminRole.id },
      },
    },
  });

  // Create staff user
  const staffPassword = await bcrypt.hash("Staff@123", 12);
  const staff = await prisma.users.upsert({
    where: { email: "staff@lmkcinema.com" },
    update: {},
    create: {
      full_name: "Staff LMK",
      email: "staff@lmkcinema.com",
      password_hash: staffPassword,
      phone: "0902345678",
      status: "active",
      user_roles: {
        create: { role_id: staffRole.id },
      },
    },
  });

  // Create customer user
  const customerPassword = await bcrypt.hash("Customer@123", 12);
  const customer = await prisma.users.upsert({
    where: { email: "customer@lmkcinema.com" },
    update: {},
    create: {
      full_name: "Customer Demo",
      email: "customer@lmkcinema.com",
      password_hash: customerPassword,
      phone: "0903456789",
      status: "active",
      user_roles: {
        create: { role_id: customerRole.id },
      },
    },
  });

  console.log("✅ Users created");

  // Create branches
  const branch1 = await prisma.branches.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "LMK Cinema Quận 1",
      address: "123 Nguyễn Huệ, Phường Bến Nghé",
      city: "TP. Hồ Chí Minh",
      hotline: "1900123401",
      status: "active",
    },
  });

  const branch2 = await prisma.branches.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "LMK Cinema Quận 7",
      address: "456 Nguyễn Thị Thập, Phường Tân Phú",
      city: "TP. Hồ Chí Minh",
      hotline: "1900123402",
      status: "active",
    },
  });

  const branch3 = await prisma.branches.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "LMK Cinema Hà Nội",
      address: "789 Hoàn Kiếm, Quận Ba Đình",
      city: "Hà Nội",
      hotline: "1900123403",
      status: "active",
    },
  });

  console.log("✅ Branches created");

  // Create screens for branch 1
  const screen1 = await prisma.screens.upsert({
    where: { id: 1 },
    update: {},
    create: {
      branch_id: branch1.id,
      name: "Phòng chiếu 1",
      seat_rows: 8,
      seat_cols: 10,
      type: "standard",
      status: "active",
    },
  });

  const screen2 = await prisma.screens.upsert({
    where: { id: 2 },
    update: {},
    create: {
      branch_id: branch1.id,
      name: "Phòng chiếu VIP",
      seat_rows: 6,
      seat_cols: 8,
      type: "vip",
      status: "active",
    },
  });

  console.log("✅ Screens created");

  // Create seats for screen 1
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 1; j <= 10; j++) {
      await prisma.seats.upsert({
        where: {
          screen_id_seat_code: {
            screen_id: screen1.id,
            seat_code: `${rows[i]}${j}`,
          },
        },
        update: {},
        create: {
          screen_id: screen1.id,
          seat_code: `${rows[i]}${j}`,
          seat_row: rows[i],
          seat_number: j,
          seat_type: i >= 6 ? "vip" : "standard",
        },
      });
    }
  }

  console.log("✅ Seats created");

  // Create movies
  const movie1 = await prisma.movies.upsert({
    where: { slug: "avatar-con-duong-nuoc" },
    update: {},
    create: {
      title: "Avatar: The Way of Water",
      slug: "avatar-con-duong-nuoc",
      synopsis:
        "Sau hơn một thập kỷ, Jake Sully và Neytiri đã xây dựng một gia đình và đang làm mọi thứ để giữ họ lại với nhau. Tuy nhiên, họ phải rời khỏi nhà và khám phá các vùng Pandora khi một mối đe dọa cũ quay trở lại.",
      genres: "Khoa học viễn tưởng, Phiêu lưu",
      duration_minutes: 192,
      rating: "T13",
      language: "Tiếng Anh",
      country: "Mỹ",
      director: "James Cameron",
      cast: "Sam Worthington, Zoe Saldaña, Sigourney Weaver",
      poster_url:
        "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      backdrop_url:
        "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
      trailer_url: "https://www.youtube.com/watch?v=d9MyW72ELq0",
      status: "now_showing",
      release_date: new Date("2023-12-14"),
      is_featured: true,
    },
  });

  const movie2 = await prisma.movies.upsert({
    where: { slug: "aquaman-va-vuong-quoc-that-lac" },
    update: {},
    create: {
      title: "Aquaman and the Lost Kingdom",
      slug: "aquaman-va-vuong-quoc-that-lac",
      synopsis:
        "Aquaman phải liên minh với một đồng minh bất ngờ để bảo vệ Atlantis và thế giới khỏi sự tàn phá không thể cứu vãn được.",
      genres: "Hành động, Phiêu lưu, Siêu anh hùng",
      duration_minutes: 124,
      rating: "T13",
      language: "Tiếng Anh",
      country: "Mỹ",
      director: "James Wan",
      cast: "Jason Momoa, Patrick Wilson, Yahya Abdul-Mateen II",
      poster_url:
        "https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg",
      backdrop_url:
        "https://image.tmdb.org/t/p/original/jXJxMcVoEuXzym3vFnjqDW4ifo6.jpg",
      trailer_url: "https://www.youtube.com/watch?v=UGc5Tzz19UY",
      status: "now_showing",
      release_date: new Date("2023-12-20"),
      is_featured: true,
    },
  });

  const movie3 = await prisma.movies.upsert({
    where: { slug: "dune-phan-hai" },
    update: {},
    create: {
      title: "Dune: Part Two",
      slug: "dune-phan-hai",
      synopsis:
        "Paul Atreides hợp nhất với Chani và người Fremen trong khi tìm kiếm một con đường trả thù cho những kẻ đã hủy hoại gia đình anh.",
      genres: "Khoa học viễn tưởng, Phiêu lưu, Hành động",
      duration_minutes: 166,
      rating: "T13",
      language: "Tiếng Anh",
      country: "Mỹ",
      director: "Denis Villeneuve",
      cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
      poster_url:
        "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      backdrop_url:
        "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
      trailer_url: "https://www.youtube.com/watch?v=Way9Dexny3w",
      status: "coming_soon",
      release_date: new Date("2024-03-01"),
      is_featured: true,
    },
  });

  console.log("✅ Movies created");

  // Create showtimes
  const today = new Date();
  today.setHours(10, 0, 0, 0);

  const showtime1 = await prisma.showtimes.create({
    data: {
      movie_id: movie1.id,
      screen_id: screen1.id,
      start_time: new Date(today.getTime()),
      end_time: new Date(today.getTime() + 192 * 60 * 1000),
      base_price: 90000,
      status: "selling",
    },
  });

  const showtime2 = await prisma.showtimes.create({
    data: {
      movie_id: movie1.id,
      screen_id: screen1.id,
      start_time: new Date(today.getTime() + 4 * 60 * 60 * 1000),
      end_time: new Date(today.getTime() + 4 * 60 * 60 * 1000 + 192 * 60 * 1000),
      base_price: 90000,
      status: "selling",
    },
  });

  const showtime3 = await prisma.showtimes.create({
    data: {
      movie_id: movie2.id,
      screen_id: screen1.id,
      start_time: new Date(today.getTime() + 8 * 60 * 60 * 1000),
      end_time: new Date(today.getTime() + 8 * 60 * 60 * 1000 + 124 * 60 * 1000),
      base_price: 85000,
      status: "selling",
    },
  });

  console.log("✅ Showtimes created");

  // Create concessions
  await prisma.concessions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Combo Couple",
      description: "1 Bắp lớn + 2 Coca-Cola lớn",
      price: 115000,
      type: "combo",
      image_url: "https://via.placeholder.com/300x200?text=Combo+Couple",
    },
  });

  await prisma.concessions.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Combo Single",
      description: "1 Bắp vừa + 1 Coca-Cola vừa",
      price: 65000,
      type: "combo",
      image_url: "https://via.placeholder.com/300x200?text=Combo+Single",
    },
  });

  await prisma.concessions.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Bắp rang bơ lớn",
      description: "Bắp rang bơ size lớn",
      price: 50000,
      type: "popcorn",
    },
  });

  await prisma.concessions.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: "Coca-Cola lớn",
      description: "Coca-Cola size lớn 500ml",
      price: 35000,
      type: "drink",
    },
  });

  console.log("✅ Concessions created");

  // Create promotions
  await prisma.promotions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Giảm 20% vào thứ 3",
      code: "TUESDAY20",
      description: "Giảm 20% giá vé vào tất cả các ngày thứ 3 trong tuần",
      discount_type: "percent",
      discount_value: 20,
      status: "active",
      start_date: new Date(),
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.promotions.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Giảm 30K cho khách hàng mới",
      code: "NEWMEMBER30",
      description: "Giảm 30.000đ cho đơn hàng đầu tiên",
      discount_type: "fixed",
      discount_value: 30000,
      min_order_value: 100000,
      status: "active",
      start_date: new Date(),
      end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Promotions created");

  console.log("🎉 Seed completed successfully!");
  console.log("\n📋 Test accounts:");
  console.log("  Admin: admin@lmkcinema.com / Admin@123");
  console.log("  Staff: staff@lmkcinema.com / Staff@123");
  console.log("  Customer: customer@lmkcinema.com / Customer@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
