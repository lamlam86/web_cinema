import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const promotions = await prisma.promotions.findMany({
      where: {
        status: "active",
        OR: [{ start_date: null }, { start_date: { lte: now } }],
        AND: [{ OR: [{ end_date: null }, { end_date: { gte: now } }] }],
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({
      promotions: promotions.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        description: p.description,
        discount_type: p.discount_type,
        discount_value: Number(p.discount_value),
        min_order_value: p.min_order_value ? Number(p.min_order_value) : null,
        start_date: p.start_date,
        end_date: p.end_date,
      })),
    });
  } catch (error) {
    console.error("GET /api/promotions error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
