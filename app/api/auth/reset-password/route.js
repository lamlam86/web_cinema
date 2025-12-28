import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Token và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
        },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.purpose !== "reset_password") {
      return NextResponse.json(
        { success: false, message: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.users.update({
      where: { id: BigInt(decoded.userId) },
      data: { password_hash: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Đã có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
