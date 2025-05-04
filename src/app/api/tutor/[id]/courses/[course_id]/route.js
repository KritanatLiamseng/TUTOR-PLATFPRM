// File: src/app/api/tutor/[id]/courses/[course_id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// GET /api/tutor/[id]/courses/[course_id]
export async function GET(request, { params }) {
  const tutorUserId = parseInt(params.id, 10);
  const courseId    = parseInt(params.course_id, 10);

  if (isNaN(tutorUserId) || isNaN(courseId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  // ตรวจว่าผู้ใช้นี้เป็นติวเตอร์จริงไหม
  const tutor = await prisma.tutor.findUnique({
    where: { user_id: tutorUserId }
  });
  if (!tutor) {
    return NextResponse.json({ error: "ไม่พบโปรไฟล์ติวเตอร์" }, { status: 404 });
  }

  // ดึงคอร์สเดียว
  const course = await prisma.tutorCourse.findUnique({
    where: { course_id: courseId },
    include: { subject: true }
  });
  if (!course || course.tutor_id !== tutor.tutor_id) {
    return NextResponse.json({ error: "ไม่พบคอร์สนี้" }, { status: 404 });
  }

  return NextResponse.json({
    course_id:          course.course_id,
    subject_id:         course.subject_id,
    subject_name:       course.subject.name,
    course_title:       course.course_title,
    course_description: course.course_description,
    rate_per_hour:      course.rate_per_hour,
    teaching_method:    course.teaching_method,
    level:              course.level,
  }, { status: 200 });
}

// PUT /api/tutor/[id]/courses/[course_id]
export async function PUT(request, { params }) {
  const tutorUserId = parseInt(params.id, 10);
  const courseId    = parseInt(params.course_id, 10);

  if (isNaN(tutorUserId) || isNaN(courseId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  // ตรวจติวเตอร์
  const tutor = await prisma.tutor.findUnique({
    where: { user_id: tutorUserId }
  });
  if (!tutor) {
    return NextResponse.json({ error: "ไม่พบโปรไฟล์ติวเตอร์" }, { status: 404 });
  }

  // ตรวจคอร์สเป็นของติวเตอร์คนนี้ไหม
  const existing = await prisma.tutorCourse.findUnique({
    where: { course_id: courseId }
  });
  if (!existing || existing.tutor_id !== tutor.tutor_id) {
    return NextResponse.json({ error: "ไม่พบคอร์สนี้" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON payload ไม่ถูกต้อง" }, { status: 400 });
  }

  const {
    subject_id,
    course_title,
    course_description = "",
    rate_per_hour,
    teaching_method = "",
    level = "",
  } = body;

  if (!subject_id || !course_title || rate_per_hour == null) {
    return NextResponse.json({ error: "ข้อมูลคอร์สไม่ครบถ้วน" }, { status: 422 });
  }

  try {
    const updated = await prisma.tutorCourse.update({
      where: { course_id: courseId },
      data: {
        subject_id:         Number(subject_id),
        course_title,
        course_description,
        rate_per_hour:      Number(rate_per_hour),
        teaching_method,
        level,
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("❌ อัปเดตคอร์สล้มเหลว:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตคอร์ส" },
      { status: 500 }
    );
  }
}
