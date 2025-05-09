// File: /api/tutor/[id]/courses/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// ✅ GET /api/tutor/[id]/courses
export async function GET(request, context) {
  const { params } = await context; // ✅ แก้ตรงนี้
  const tutorUserId = Number(params.id);

  if (Number.isNaN(tutorUserId)) {
    return NextResponse.json({ error: "ID ติวเตอร์ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const tutor = await prisma.tutor.findUnique({
      where: { user_id: tutorUserId },
    });

    if (!tutor) {
      return NextResponse.json({ error: "ไม่พบโปรไฟล์ติวเตอร์" }, { status: 404 });
    }

    const courses = await prisma.tutorCourse.findMany({
      where: { tutor_id: tutor.tutor_id },
      include: { subject: true },
      orderBy: { course_id: "desc" },
    });

    const formatted = courses.map((c) => ({
      course_id: c.course_id,
      subject_id: c.subject_id,
      course_title: c.course_title,
      subject_name: c.subject?.name || "-",
      level: c.level || "-",
      rate_per_hour: c.rate_per_hour || 0,
      teaching_method: c.teaching_method || "-",
      course_description: c.course_description || "",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("❌ ดึงคอร์สล้มเหลว:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการโหลดคอร์ส" }, { status: 500 });
  }
}

// ✅ POST /api/tutor/[id]/courses
export async function POST(request, context) {
  const { params } = await context; // ✅ แก้ตรงนี้
  const tutorUserId = Number(params.id);

  if (Number.isNaN(tutorUserId)) {
    return NextResponse.json({ error: "ID ติวเตอร์ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const tutor = await prisma.tutor.findUnique({
      where: { user_id: tutorUserId },
    });

    if (!tutor) {
      return NextResponse.json({ error: "ไม่พบโปรไฟล์ติวเตอร์" }, { status: 404 });
    }

    const body = await request.json();
    const subject_id = Number(body.subject_id);
    const rate_per_hour = Number(body.rate_per_hour);
    const { course_title, course_description, teaching_method, level } = body;

    if (
      Number.isNaN(subject_id) ||
      Number.isNaN(rate_per_hour) ||
      typeof course_title !== "string" ||
      typeof teaching_method !== "string" ||
      typeof level !== "string"
    ) {
      return NextResponse.json({ error: "ข้อมูลในฟอร์มไม่ถูกต้อง" }, { status: 400 });
    }

    const created = await prisma.tutorCourse.create({
      data: {
        tutor_id: tutor.tutor_id,
        subject_id,
        course_title,
        course_description: course_description || "",
        rate_per_hour,
        teaching_method,
        level,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("❌ สร้างคอร์สล้มเหลว:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างคอร์ส" }, { status: 500 });
  }
}
