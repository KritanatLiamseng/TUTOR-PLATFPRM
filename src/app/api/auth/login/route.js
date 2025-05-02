import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // 1) หาผู้ใช้ตาม username
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return NextResponse.json({ error: "ไม่พบบัญชีผู้ใช้" }, { status: 404 });
    }

    // 2) ตรวจสอบรหัสผ่าน
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // 3) สร้าง token (ตัวอย่าง mock)
    const token = `${user.user_id}:${user.username}`;

    // 4) ตอบกลับ
    return NextResponse.json({
      message: "เข้าสู่ระบบสำเร็จ",
      user_id: user.user_id,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}
