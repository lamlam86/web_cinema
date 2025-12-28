import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const showtime = await prisma.showtimes.findUnique({
      where: { id: BigInt(id) },
      include: {
        screen: {
          include: {
            seats: true,
            branch: true,
          },
        },
        movie: true,
      },
    });

    if (!showtime) {
      return NextResponse.json({ error: "Suất chiếu không tồn tại" }, { status: 404 });
    }

    // Get booked seats
    const bookedItems = await prisma.booking_items.findMany({
      where: {
        booking: {
          showtime_id: BigInt(id),
          status: { in: ["reserved", "confirmed"] },
        },
      },
      select: { seat_id: true },
    });

    const bookedSeatIds = new Set(bookedItems.map((item) => item.seat_id));

    // Group seats by row
    const seatsByRow = {};
    showtime.screen.seats.forEach((seat) => {
      if (!seatsByRow[seat.seat_row]) {
        seatsByRow[seat.seat_row] = [];
      }
      seatsByRow[seat.seat_row].push({
        id: seat.id,
        code: seat.seat_code,
        row: seat.seat_row,
        number: seat.seat_number,
        type: seat.seat_type,
        isBooked: bookedSeatIds.has(seat.id),
        price: Number(showtime.base_price) * (seat.seat_type === "vip" ? 1.3 : seat.seat_type === "couple" ? 2 : 1),
      });
    });

    // Sort seats by number within each row
    Object.keys(seatsByRow).forEach((row) => {
      seatsByRow[row].sort((a, b) => a.number - b.number);
    });

    return NextResponse.json({
      showtime: {
        id: Number(showtime.id),
        start_time: showtime.start_time,
        end_time: showtime.end_time,
        base_price: Number(showtime.base_price),
        movie: {
          id: Number(showtime.movie.id),
          title: showtime.movie.title,
          poster_url: showtime.movie.poster_url,
          duration_minutes: showtime.movie.duration_minutes,
        },
        screen: {
          id: showtime.screen.id,
          name: showtime.screen.name,
          type: showtime.screen.type,
          rows: showtime.screen.seat_rows,
          cols: showtime.screen.seat_cols,
        },
        branch: {
          id: showtime.screen.branch.id,
          name: showtime.screen.branch.name,
          address: showtime.screen.branch.address,
        },
      },
      seats: seatsByRow,
      bookedCount: bookedSeatIds.size,
      totalSeats: showtime.screen.seats.length,
    });
  } catch (error) {
    console.error("GET /api/showtimes/[id]/seats error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
