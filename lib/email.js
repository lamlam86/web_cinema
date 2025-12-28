import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send reset password email
export async function sendResetPasswordEmail(email, nameOrToken, token) {
  const transporter = createTransporter();
  
  // Support both (email, token) and (email, name, token) signatures
  const actualToken = token || nameOrToken;
  const userName = token ? nameOrToken : null;
  
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${actualToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_USER || "noreply@lmkcinema.com",
    to: email,
    subject: "Đặt lại mật khẩu - LMK Cinema",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">LMK Cinema</h2>
        <h3>Đặt lại mật khẩu</h3>
        ${userName ? `<p>Xin chào ${userName},</p>` : ''}
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
        <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Đặt lại mật khẩu
        </a>
        <p style="color: #666; font-size: 14px;">
          Link này sẽ hết hạn sau 1 giờ.
          <br/>
          Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">© 2024 LMK Cinema. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return { success: false, error: error.message };
  }
}

// Send ticket email with QR code
export async function sendTicketEmail(booking, qrCodeDataUrl) {
  const transporter = createTransporter();
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const mailOptions = {
    from: process.env.SMTP_USER || "noreply@lmkcinema.com",
    to: booking.email || booking.user?.email,
    subject: `Vé xem phim - ${booking.movie?.title || booking.movie_title} - LMK Cinema`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0622; color: #fff; padding: 24px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #8b5cf6; margin: 0;">🎬 LMK Cinema</h2>
          <p style="color: #c9b9ef;">Vé điện tử của bạn</p>
        </div>
        
        <div style="background: rgba(139, 92, 246, 0.15); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #fff; margin: 0 0 12px;">${booking.movie?.title || booking.movie_title}</h3>
          <div style="color: #c9b9ef; font-size: 14px;">
            <p style="margin: 8px 0;">📍 ${booking.branch?.name || booking.branch_name}</p>
            <p style="margin: 8px 0;">📅 ${formatDate(booking.showtime?.start_time || booking.show_date)}</p>
            <p style="margin: 8px 0;">🕐 ${formatTime(booking.showtime?.start_time || booking.show_time)}</p>
            <p style="margin: 8px 0;">🎬 Phòng: ${booking.screen?.name || booking.screen_name || "N/A"}</p>
            <p style="margin: 8px 0;">💺 Ghế: ${booking.seats || booking.seat_numbers || "N/A"}</p>
          </div>
        </div>
        
        <div style="text-align: center; background: #fff; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <p style="color: #333; margin: 0 0 12px; font-weight: bold;">Mã QR vé của bạn</p>
          <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 200px; height: 200px;"/>
          <p style="color: #666; font-size: 12px; margin: 12px 0 0;">
            Mã đặt vé: <strong style="color: #8b5cf6;">${booking.booking_code}</strong>
          </p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h4 style="color: #fff; margin: 0 0 12px;">Chi tiết thanh toán</h4>
          <div style="display: flex; justify-content: space-between; color: #c9b9ef; font-size: 14px;">
            <span>Tổng thanh toán:</span>
            <span style="color: #22d3ee; font-weight: bold;">${formatCurrency(booking.total_amount || booking.total)}</span>
          </div>
        </div>
        
        <div style="text-align: center; padding: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="color: #a995d4; font-size: 12px; margin: 0;">
            Vui lòng xuất trình mã QR này tại quầy để nhận vé.
            <br/>
            Cảm ơn bạn đã sử dụng dịch vụ của LMK Cinema!
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">© 2024 LMK Cinema. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending ticket email:", error);
    return { success: false, error: error.message };
  }
}
