import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.roles?.includes("admin") && !user.roles?.includes("staff"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    let where = {};
    if (role) {
      where = {
        user_roles: {
          some: {
            role: { name: role },
          },
        },
      };
    }

    const users = await prisma.users.findMany({
      where,
      include: {
        user_roles: { include: { role: true } },
      },
      orderBy: { created_at: "desc" },
      take: 100,
    });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id.toString(),
        fullName: u.full_name,
        email: u.email,
        phone: u.phone,
        points: u.points,
        status: u.status,
        roles: u.user_roles.map((ur) => ur.role.name),
        createdAt: u.created_at,
      })),
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
