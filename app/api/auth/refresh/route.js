import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/auth";

export async function POST() {
  try {
    const user = await refreshAccessToken();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không thể refresh token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { success: false, message: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}
