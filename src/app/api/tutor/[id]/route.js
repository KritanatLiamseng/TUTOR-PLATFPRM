// src/app/api/tutor/[id]/route.js
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  // 1) await context.params ก่อน
  const params = await context.params;
  const tutorId = parseInt(params.id, 10);

  // 2) ตรวจสอบ ID
  if (isNaN(tutorId)) {
    return NextResponse.json(
      { error: "ID ไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  try {
    // 3) ดึงข้อมูลติวเตอร์จากฐานข้อมูล
    const userWithTutor = await prisma.user.findUnique({
      where: { user_id: tutorId },
      include: { tutor: true },
    });

    if (!userWithTutor || !userWithTutor.tutor) {
      return NextResponse.json(
        { error: "ไม่พบบัญชีติวเตอร์" },
        { status: 404 }
      );
    }

    // 4) จัดรูปแบบ response
    const t = userWithTutor.tutor;
    return NextResponse.json({
      user_id: userWithTutor.user_id,
      name: userWithTutor.name,
      phone: userWithTutor.phone,
      email: userWithTutor.email,
      username: userWithTutor.username,
      profile_image: userWithTutor.profile_image,
      education_level: userWithTutor.education_level,
      document_id_card: t.verification_documents,
      document_profile: userWithTutor.profile_image,
      document_certificate: t.education_background,
      bio: t.bio,
      experience_years: t.experience_years,
    });
  } catch (err) {
    console.error("📛 ERROR fetching tutor:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดที่ server" },
      { status: 500 }
    );
  }
}
