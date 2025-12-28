import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.roles?.includes("admin") && !user.roles?.includes("staff"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.bookings.findMany({
      include: {
        booking_items: { include: { seat: true } },
        showtime: {
          include: {
            movie: true,
            screen: { include: { branch: true } },
          },
        },
        user: true,
      },
      orderBy: { created_at: "desc" },
      take: 100,
    });

    return NextResponse.json({
      orders: bookings.map((b) => ({
        id: Number(b.id),
        booking_code: b.booking_code,
        total_amount: Number(b.total_amount),
        status: b.status,
        payment_status: b.payment_status,
        created_at: b.created_at,
        seats: b.booking_items.map((item) => item.seat.seat_code),
        movie: b.showtime.movie.title,
        branch: b.showtime.screen.branch.name,
        screen: b.showtime.screen.name,
        showtime: b.showtime.start_time,
        customer: b.user?.full_name || "Khách",
        email: b.user?.email,
      })),
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
