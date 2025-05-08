import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

// ✅ GET /api/tutor/[id]
export async function GET(request, context) {
  const { params } = await context; // ✅ ต้อง await สำหรับ Edge API
  const userId = Number(params.id);

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const userWithTutor = await prisma.user.findUnique({
      where: { user_id: userId },
      include: { tutor: true },
    });

    if (!userWithTutor?.tutor) {
      return NextResponse.json(
        { error: "ไม่พบบัญชีติวเตอร์" },
        { status: 404 }
      );
    }

    const {
      user_id,
      name,
      surname,
      phone,
      email,
      username,
      profile_image,
      education_level,
      tutor,
    } = userWithTutor;

    return NextResponse.json({
      user_id,
      tutor_id: tutor.tutor_id,
      name,
      surname,
      phone,
      email,
      username,
      profile_image,
      education_level,
      bio: tutor.bio,
      experience_years: tutor.experience_years,
      rate_per_hour: tutor.rate_per_hour,
      available_time: tutor.available_time,
      education_background: tutor.education_background,
    });
  } catch (err) {
    console.error("❌ ดึงข้อมูลติวเตอร์ล้มเหลว:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}
