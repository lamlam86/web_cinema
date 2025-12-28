import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email là bắt buộc" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu",
      });
    }

    const token = generateToken({
      userId: user.id.toString(),
      email: user.email,
      purpose: "reset_password",
    });

    await sendResetPasswordEmail(user.email, user.full_name, token);

    return NextResponse.json({
      success: true,
      message: "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Đã có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
