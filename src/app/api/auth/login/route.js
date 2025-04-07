import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "ไม่พบบัญชีผู้ใช้" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // สมมุติว่าเราสร้าง token สำหรับ auth (ในอนาคตใช้ JWT จริง)
    const mockToken = `${user.username}-mock-token`;

    return NextResponse.json({
      message: "เข้าสู่ระบบสำเร็จ",
      role: user.role,
      user_id: user.user_id,
      token: mockToken, // <-- ส่งกลับไปเก็บไว้ใน localStorage
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดที่ server" }, { status: 500 });
  }
}
