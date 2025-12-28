import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";

export async function PUT(request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Chưa đăng nhập" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, phone, currentPassword, newPassword } = body;

    const user = await prisma.users.findUnique({
      where: { id: BigInt(currentUser.id) },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    const updateData = {};

    if (fullName) {
      updateData.full_name = fullName;
    }

    if (phone !== undefined) {
      updateData.phone = phone || null;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: "Vui lòng nhập mật khẩu hiện tại" },
          { status: 400 }
        );
      }

      const isValidPassword = await verifyPassword(currentPassword, user.password_hash);

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: "Mật khẩu hiện tại không đúng" },
          { status: 400 }
        );
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return NextResponse.json(
          {
            success: false,
            message: "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
          },
          { status: 400 }
        );
      }

      updateData.password_hash = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.users.update({
      where: { id: BigInt(currentUser.id) },
      data: updateData,
      include: {
        user_roles: {
          include: { role: true },
        },
      },
    });

    const roles = updatedUser.user_roles.map((ur) => ur.role.name);

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: {
        id: updatedUser.id.toString(),
        fullName: updatedUser.full_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatar_url,
        roles,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, message: "Đã có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
