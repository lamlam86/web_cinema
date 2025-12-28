import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branches.findMany({
      where: { status: "active" },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      branches: branches.map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        city: b.city,
        hotline: b.hotline,
        latitude: b.latitude ? Number(b.latitude) : null,
        longitude: b.longitude ? Number(b.longitude) : null,
      })),
    });
  } catch (error) {
    console.error("GET /api/branches error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
