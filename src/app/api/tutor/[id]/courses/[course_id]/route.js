// File: /api/tutor/[id]/courses/[course_id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// GET /api/tutor/[id]/courses/[course_id]
export async function GET(request, context) {
  const { params } = context;
  const courseId = Number(params.course_id);
  if (Number.isNaN(courseId)) {
    return NextResponse.json({ error: "ID คอร์สไม่ถูกต้อง" }, { status: 400 });
  }

  const course = await prisma.tutorCourse.findUnique({
    where: { course_id: courseId },
    include: {
      subject: true,
      tutor: {
        include: {
          user: { select: { name: true, surname: true, profile_image: true } },
        },
      },
    },
  });
  if (!course) {
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
    tutor: {
      tutor_id:      course.tutor.tutor_id,
      name:          course.tutor.user.name,
      surname:       course.tutor.user.surname,
      profile_image: course.tutor.user.profile_image,
    },
  });
}

// PUT /api/tutor/[id]/courses/[course_id]
export async function PUT(request, context) {
  const { params } = context;
  const courseId = Number(params.course_id);
  if (Number.isNaN(courseId)) {
    return NextResponse.json({ error: "ID คอร์สไม่ถูกต้อง" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON payload ไม่ถูกต้อง" }, { status: 400 });
  }

  const subject_id       = Number(body.subject_id);
  const rate_per_hour    = Number(body.rate_per_hour);
  const {
    course_title,
    course_description = "",
    teaching_method = "",
    level = "",
  } = body;

  if (
    Number.isNaN(subject_id) ||
    Number.isNaN(rate_per_hour) ||
    typeof course_title !== "string"
  ) {
    return NextResponse.json({ error: "ข้อมูลคอร์สไม่ครบถ้วน" }, { status: 422 });
  }

  try {
    const updated = await prisma.tutorCourse.update({
      where: { course_id: courseId },
      data: {
        subject_id,
        course_title,
        course_description,
        rate_per_hour,
        teaching_method,
        level,
      },
    });
    return NextResponse.json({
      course_id:    updated.course_id,
      subject_id:   updated.subject_id,
      course_title: updated.course_title,
    });
  } catch (err) {
    console.error("❌ อัปเดตคอร์สล้มเหลว:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตคอร์ส" },
      { status: 500 }
    );
  }
}

// DELETE /api/tutor/[id]/courses/[course_id]
export async function DELETE(request, context) {
  const { params } = context;
  const tutorUserId = Number(params.id);
  const courseId    = Number(params.course_id);
  if (Number.isNaN(tutorUserId) || Number.isNaN(courseId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  const tutor = await prisma.tutor.findUnique({
    where: { user_id: tutorUserId },
  });
  if (!tutor) {
    return NextResponse.json({ error: "ไม่พบโปรไฟล์ติวเตอร์" }, { status: 404 });
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
