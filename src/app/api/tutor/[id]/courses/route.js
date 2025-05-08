// File: src/app/api/tutor/[id]/courses/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// GET  /api/tutor/[id]/courses
// POST /api/tutor/[id]/courses
// DELETE /api/tutor/[id]/courses/[course_id]
export async function GET(request, { params }) {
  const tutorUserId = Number(params.id);
  if (Number.isNaN(tutorUserId)) {
    return NextResponse.json({ error: "ID ติวเตอร์ไม่ถูกต้อง" }, { status: 400 });
  }

  const tutor = await prisma.tutor.findUnique({
    where: { user_id: tutorUserId },
  });
  if (!tutor) {
    return NextResponse.json({ error: "ไม่พบบัญชีติวเตอร์" }, { status: 404 });
  }

  try {
    const courses = await prisma.tutorCourse.findMany({
      where: { tutor_id: tutor.tutor_id },
      include: { subject: true },
      orderBy: { course_id: "desc" },
    });
    const formatted = courses.map((c) => ({
      course_id:          c.course_id,
      subject_id:         c.subject_id,
      course_title:       c.course_title,
      subject_name:       c.subject?.name || "-",
      level:              c.level         || "-",
      rate_per_hour:      c.rate_per_hour || 0,
      teaching_method:    c.teaching_method || "-",
      course_description: c.course_description || "",
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

export async function POST(request, { params }) {
  const tutorUserId = Number(params.id);
  if (Number.isNaN(tutorUserId)) {
    return NextResponse.json({ error: "ID ติวเตอร์ไม่ถูกต้อง" }, { status: 400 });
  }

  const tutor = await prisma.tutor.findUnique({
    where: { user_id: tutorUserId },
  });
  if (!tutor) {
    return NextResponse.json({ error: "ไม่พบบัญชีติวเตอร์" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload ไม่เป็น JSON" }, { status: 400 });
  }

  const subject_id       = Number(body.subject_id);
  const rate_per_hour    = Number(body.rate_per_hour);
  const { course_title, course_description = "", teaching_method, level } = body;

  if (
    Number.isNaN(subject_id) ||
    Number.isNaN(rate_per_hour) ||
    !course_title ||
    !teaching_method ||
    !level
  ) {
    return NextResponse.json(
      { error: "ข้อมูลในฟอร์มไม่ครบถ้วนหรือไม่ถูกต้อง" },
      { status: 422 }
    );
  }

  try {
    const created = await prisma.tutorCourse.create({
      data: {
        tutor_id:           tutor.tutor_id,
        subject_id,
        course_title,
        course_description,
        rate_per_hour,
        teaching_method,
        level,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("❌ สร้างคอร์สล้มเหลว:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างคอร์ส" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const tutorUserId = Number(params.id);
  const courseId    = Number(params.course_id);
  if (Number.isNaN(tutorUserId) || Number.isNaN(courseId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  const tutor = await prisma.tutor.findUnique({
    where: { user_id: tutorUserId },
  });
  if (!tutor) {
    return NextResponse.json({ error: "ไม่พบบัญชีติวเตอร์" }, { status: 404 });
  }

  const bookingCount = await prisma.booking.count({
    where: { course_id: courseId },
  });
  if (bookingCount > 0) {
    return NextResponse.json(
      { error: "ไม่สามารถลบคอร์สที่มีการจองอยู่ได้" },
      { status: 409 }
    );
  }

  try {
    await prisma.tutorCourse.delete({
      where: { course_id: courseId },
    });
    return NextResponse.json({ message: "ลบคอร์สเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("❌ ลบคอร์สล้มเหลว:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบคอร์ส" },
      { status: 500 }
    );
  }
}
