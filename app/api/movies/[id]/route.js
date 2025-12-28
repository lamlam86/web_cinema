import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const movie = await prisma.movies.findUnique({
      where: { id: BigInt(id) },
      include: {
        showtimes: {
          where: {
            start_time: { gte: new Date() },
            status: { in: ["scheduled", "selling"] },
          },
          include: {
            screen: {
              include: { branch: true },
            },
          },
          orderBy: { start_time: "asc" },
        },
        _count: { select: { showtimes: true } },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Không tìm thấy phim" }, { status: 404 });
    }

    const data = {
      id: Number(movie.id),
      title: movie.title,
      slug: movie.slug,
      poster: movie.poster_url,
      backdrop: movie.backdrop_url,
      trailer: movie.trailer_url,
      synopsis: movie.synopsis,
      genres: movie.genres,
      language: movie.language,
      country: movie.country,
      director: movie.director,
      cast: movie.cast,
      status: movie.status,
      releaseDate: movie.release_date?.toISOString().split("T")[0] || "",
      duration: movie.duration_minutes ?? 0,
      rating: movie.rating ?? "",
      isFeatured: movie.is_featured,
      showtimes: movie.showtimes.map((st) => ({
        id: Number(st.id),
        startTime: st.start_time,
        endTime: st.end_time,
        basePrice: Number(st.base_price),
        screen: {
          id: st.screen.id,
          name: st.screen.name,
          type: st.screen.type,
        },
        branch: st.screen.branch
          ? {
              id: st.screen.branch.id,
              name: st.screen.branch.name,
              address: st.screen.branch.address,
              city: st.screen.branch.city,
            }
          : null,
      })),
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/movies/[id] failed", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const movie = await prisma.movies.update({
      where: { id: BigInt(id) },
      data: {
        title: body.title,
        poster_url: body.poster ?? null,
        backdrop_url: body.backdrop ?? null,
        trailer_url: body.trailer ?? null,
        synopsis: body.synopsis ?? null,
        genres: body.genres ?? null,
        language: body.language ?? null,
        country: body.country ?? null,
        director: body.director ?? null,
        cast: body.cast ?? null,
        release_date: body.releaseDate ? new Date(body.releaseDate) : null,
        duration_minutes: body.duration ?? null,
        rating: body.rating ?? null,
        status: body.status,
        is_featured: body.isFeatured ?? false,
      },
    });

    return NextResponse.json({
      data: {
        id: Number(movie.id),
        title: movie.title,
        status: movie.status,
      },
    });
  } catch (error) {
    console.error("PUT /api/movies/[id] failed", error);
    return NextResponse.json({ error: "Không thể cập nhật phim" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.movies.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/movies/[id] failed", error);
    return NextResponse.json({ error: "Không thể xóa phim" }, { status: 500 });
  }
}
