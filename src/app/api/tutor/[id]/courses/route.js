import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// GET /api/tutor/[id]/courses
export async function GET(request, context) {
  // 1) await context.params
  const params = await context.params;
  const tutorUserId = parseInt(params.id, 10);
  if (isNaN(tutorUserId)) {
    return NextResponse.json({ error: "ID ติวเตอร์ไม่ถูกต้อง" }, { status: 400 });
  }

  // 2) หา Tutor ตาม user_id
  const tutor = await prisma.tutor.findUnique({ where: { user_id: tutorUserId } });
  if (!tutor) {
    return NextResponse.json({ error: "ไม่พบโปรไฟล์ติวเตอร์" }, { status: 404 });
  }

  try {
    // 3) ดึงคอร์สโดยใช้ prisma.tutorCourse
    const courses = await prisma.tutorCourse.findMany({
      where: { tutor_id: tutor.tutor_id },
      include: { subject: true },
    });

    if (courses.length === 0) {
      return NextResponse.json({ error: "ไม่พบคอร์สเรียน" }, { status: 404 });
    }

    const formatted = courses.map((c) => ({
      course_id: c.course_id,
      course_title: c.course_title,
      level: c.level,
      rate_per_hour: c.rate_per_hour,
      teaching_method: c.teaching_method,
      course_description: c.course_description,
      subject_name: c.subject?.name ?? "ไม่ระบุวิชา",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("❌ ดึงคอร์สล้มเหลว:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการโหลดคอร์ส" },
      { status: 500 }
    );
  }
}

// POST /api/tutor/[id]/courses
export async function POST(request, context) {
  const params = await context.params;
  const tutorUserId = parseInt(params.id, 10);
  if (isNaN(tutorUserId)) {
    return NextResponse.json({ error: "ID ติวเตอร์ไม่ถูกต้อง" }, { status: 400 });
  }

  const tutor = await prisma.tutor.findUnique({ where: { user_id: tutorUserId } });
  if (!tutor) {
    return NextResponse.json({ error: "ไม่พบโปรไฟล์ติวเตอร์" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON payload ไม่ถูกต้อง" }, { status: 400 });
  }

  const { subject_id, course_title, rate_per_hour } = body;
  if (!subject_id || !course_title || rate_per_hour == null) {
    return NextResponse.json({ error: "ข้อมูลคอร์สไม่ครบถ้วน" }, { status: 422 });
  }

  try {
    const newCourse = await prisma.tutorCourse.create({
      data: {
        tutor_id:         tutor.tutor_id,
        subject_id:       Number(subject_id),
        course_title:     body.course_title,
        course_description: body.course_description ?? "",
        rate_per_hour:    Number(body.rate_per_hour),
        teaching_method:  body.teaching_method ?? "",
        level:            body.level ?? "",
      },
    });
    return NextResponse.json(newCourse, { status: 201 });
  } catch (err) {
    console.error("❌ สร้างคอร์สล้มเหลว:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างคอร์ส" },
      { status: 500 }
    );
  }
}
