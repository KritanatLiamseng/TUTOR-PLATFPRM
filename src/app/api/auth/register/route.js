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
      role,            // 'student' หรือ 'tutor'
      bio,             // เฉพาะ tutor
      experienceYears, // เฉพาะ tutor
      ratePerHour,     // ถ้ามี
      availableTime,   // ถ้ามี
      educationLevel,  // ถ้ามี
    } = await request.json();

    // --- 1) ตรวจข้อมูลเบื้องต้น ---
    if (!name || !surname || !email || !username || !password) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 422 }
      );
    }

    // --- 2) เช็คซ้ำ username / email ---
    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (exists) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานไปแล้ว" },
        { status: 409 }
      );
    }

    // --- 3) แฮชรหัสผ่าน ---
    const hashed = await bcrypt.hash(password, 10);

    // --- 4) สร้าง User ---
    const newUser = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        phone,
        username,
        password: hashed,
        role: role === "tutor" ? "tutor" : "student",
        education_level: educationLevel ?? null,
      },
    });

    // --- 5) ถ้าเป็น tutor ให้สร้างเรคอร์ดในตาราง tutors ---
    if (role === "tutor") {
      await prisma.tutor.create({
        data: {
          user_id: newUser.user_id,
          bio: bio ?? "",
          experience_years: Number(experienceYears) || 0,
          rate_per_hour: Number(ratePerHour) || 0,
          available_time: availableTime ?? "",
          education_background: "",   // หรือรับจาก payload เพิ่ม
        },
      });
    }

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register Error:", err);

    // กรณี unique constraint ที่ไม่ใช่ user
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "ข้อมูลซ้ำในระบบ (user หรือ tutor)" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}
