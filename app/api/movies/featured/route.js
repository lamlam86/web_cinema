import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const movies = await prisma.movies.findMany({
      where: {
        OR: [{ is_featured: true }, { status: "now_showing" }],
      },
      orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
      take: 10,
    });

    const data = movies.map((movie) => ({
      id: Number(movie.id),
      title: movie.title,
      poster: movie.poster_url,
      backdrop: movie.backdrop_url,
      trailer: movie.trailer_url,
      status: movie.status,
      isFeatured: movie.is_featured,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/movies/featured failed", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
