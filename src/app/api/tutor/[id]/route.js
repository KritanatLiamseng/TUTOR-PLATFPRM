// ✅ File: src/app/api/tutor/[id]/route.js
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  const params = await context.params;
  const userId = Number(params.id);

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const userWithTutor = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        tutor: {
          include: {
            tutor_courses: {
              select: {
                course_id: true,
                course_title: true,
                rate_per_hour: true,
                teaching_method: true,
                level: true,
                subject: {
                  select: { subject_id: true, name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithTutor?.tutor) {
      return NextResponse.json({ error: "ไม่พบบัญชีติวเตอร์" }, { status: 404 });
    }

    const { tutor } = userWithTutor;
    return NextResponse.json({
      user_id: userWithTutor.user_id,
      name: userWithTutor.name,
      surname: userWithTutor.surname,
      email: userWithTutor.email,
      phone: userWithTutor.phone,
      username: userWithTutor.username,
      profile_image: userWithTutor.profile_image,
      tutor_id: tutor.tutor_id,
      bio: tutor.bio,
      experience_years: tutor.experience_years,
      rate_per_hour: tutor.rate_per_hour,
      available_time: tutor.available_time,
      education_background: tutor.education_background,
      courses: tutor.tutor_courses.map((c) => ({
        course_id: c.course_id,
        title: c.course_title,
        rate: c.rate_per_hour,
        method: c.teaching_method,
        level: c.level,
        subject_id: c.subject.subject_id,
        subject_name: c.subject.name,
      })),
    });
  } catch (err) {
    console.error("❌ ดึงข้อมูลติวเตอร์ล้มเหลว:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const params = await context.params;
  const userId = Number(params.id);

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "ข้อมูล Form ไม่ถูกต้อง" }, { status: 400 });
  }

  const education_level = formData.get("education_level") || "";
  const experience_years = parseInt(formData.get("experience_years") || "0", 10);
  const available_time = formData.get("available_time") || "";
  const rate_per_hour = parseFloat(formData.get("rate_per_hour") || "0");
  const bio = formData.get("bio") || "";
  const imageFile = formData.get("profile_image");

  const name = formData.get("name") || "";
  const phone = formData.get("phone") || "";
  const email = formData.get("email") || "";
  const username = formData.get("username") || "";

  const tutorUpdateData = {
    education_background: education_level,
    experience_years,
    available_time,
    rate_per_hour,
    bio,
  };

  const userUpdateData = {
    name,
    phone,
    email,
    username,
  };

  if (imageFile && typeof imageFile === "object" && "arrayBuffer" in imageFile) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = imageFile.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;
    userUpdateData.profile_image = dataUrl;
  }

  try {
    await prisma.tutor.update({
      where: { user_id: userId },
      data: tutorUpdateData,
    });

    await prisma.user.update({
      where: { user_id: userId },
      data: userUpdateData,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ PUT /api/tutor/[id] failed:", err);
    return NextResponse.json({ error: "ไม่สามารถอัปเดตโปรไฟล์ได้" }, { status: 500 });
  }
}