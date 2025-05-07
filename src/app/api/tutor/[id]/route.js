import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

// GET /api/tutor/[id]
export async function GET(request, context) {
  // 1) await context เพื่อปลดล็อก params
  const { params } = await context;
  const tutorUserId = Number(params.id);
  if (Number.isNaN(tutorUserId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    // 2) หา user + tutor profile
    const userWithTutor = await prisma.user.findUnique({
      where: { user_id: tutorUserId },
      include: { tutor: true },
    });
    if (!userWithTutor?.tutor) {
      return NextResponse.json(
        { error: "ไม่พบบัญชีติวเตอร์" },
        { status: 404 }
      );
    }

    const { user_id, name, surname, phone, email, username, profile_image, education_level, tutor } =
      userWithTutor;

    // 3) คืน JSON ตามต้องการ
    return NextResponse.json({
      user_id,
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
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
