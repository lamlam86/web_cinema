import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ movies: [], branches: [] });
    }

    const query = q.trim();

    const [movies, branches] = await Promise.all([
      prisma.movies.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { genres: { contains: query } },
            { director: { contains: query } },
          ],
          status: { in: ["now_showing", "coming_soon"] },
        },
        take: 10,
        orderBy: { created_at: "desc" },
      }),
      prisma.branches.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { city: { contains: query } },
            { address: { contains: query } },
          ],
          status: "active",
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      movies: movies.map((m) => ({
        id: Number(m.id),
        title: m.title,
        poster: m.poster_url,
        genres: m.genres,
        status: m.status,
        releaseDate: m.release_date?.toISOString().split("T")[0] || "",
      })),
      branches: branches.map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        city: b.city,
      })),
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
