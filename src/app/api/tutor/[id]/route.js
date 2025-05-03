// src/app/api/tutor/[id]/route.js
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const tutorUserId = parseInt(params.id, 10);
  if (isNaN(tutorUserId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const userWithTutor = await prisma.user.findUnique({
      where: { user_id: tutorUserId },
      include: { tutor: true },
    });
    if (!userWithTutor || !userWithTutor.tutor) {
      return NextResponse.json({ error: "ไม่พบบัญชีติวเตอร์" }, { status: 404 });
    }

    const u = userWithTutor;
    const t = u.tutor;
    return NextResponse.json({
      user_id:            u.user_id,
      name:               u.name,
      surname:            u.surname,
      phone:              u.phone,
      email:              u.email,
      username:           u.username,
      profile_image:      u.profile_image,
      education_level:    u.education_level,
      bio:                t.bio,
      experience_years:   t.experience_years,
      rate_per_hour:      t.rate_per_hour,
      available_time:     t.available_time,
      education_background: t.education_background,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
