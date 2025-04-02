import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const {
      name,
      surname,
      email,
      phone,
      username,
      password,
      role,
      isTutor,
      bio,
      experienceYears,
    } = await request.json();

    // ตรวจสอบว่ามีผู้ใช้นี้อยู่แล้วหรือไม่
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรืออีเมลมีอยู่แล้วในระบบ" },
        { status: 409 }
      );
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างบัญชีผู้ใช้งาน
    const newUser = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        phone,
        username,
        password: hashedPassword,
        role: role === "tutor" ? "tutor" : "student",
      },
    });

    // ถ้าเป็นติวเตอร์ → เพิ่มข้อมูลลงตาราง tutor
    if (isTutor) {
      await prisma.tutor.create({
        data: {
          user_id: newUser.user_id,
          bio,
          experience_years: parseInt(experienceYears, 10) || 0,
        },
      });
    }

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ" });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดที่ server" },
      { status: 500 }
    );
  }
}
