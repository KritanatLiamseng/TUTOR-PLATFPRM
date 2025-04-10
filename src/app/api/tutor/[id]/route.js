import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { id } = context.params;

  try {
    const tutor = await prisma.user.findUnique({
      where: { user_id: parseInt(id, 10) },
      include: {
        tutor: true, // include ข้อมูลจากตาราง tutor
      },
    });

    if (!tutor || !tutor.tutor) {
      return NextResponse.json({ error: "ไม่พบบัญชีติวเตอร์" }, { status: 404 });
    }

    return NextResponse.json({
      user_id: tutor.user_id,
      name: tutor.name,
      phone: tutor.phone,
      email: tutor.email,
      username: tutor.username,
      profile_image: tutor.profile_image,
      education_level: tutor.education_level,
      document_id_card: tutor.tutor.verification_documents,
      document_profile: tutor.profile_image,
      document_certificate: tutor.tutor.education_background,
      bio: tutor.tutor.bio,
      experience_years: tutor.tutor.experience_years,
    });
  } catch (err) {
    console.error("📛 ERROR:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดที่ server" }, { status: 500 });
  }
}
