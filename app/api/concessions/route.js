import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const concessions = await prisma.concessions.findMany({
      where: type ? { type } : {},
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      concessions: concessions.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        price: Number(c.price),
        type: c.type,
        image_url: c.image_url,
      })),
    });
  } catch (error) {
    console.error("GET /api/concessions error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
