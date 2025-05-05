import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// GET /api/tutor/[id]/courses
export async function GET(request, context) {
  // 1) unwrap context ก่อน แล้วค่อยเอา params
  const { params } = await context;
  const tutorUserId = parseInt(params.id, 10);
  if (isNaN(tutorUserId)) {
    return NextResponse.json(
      { error: "ID ติวเตอร์ไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  // หาโปรไฟล์ติวเตอร์จาก user_id
  const tutor = await prisma.tutor.findUnique({
    where: { user_id: tutorUserId },
  });
  if (!tutor) {
    return NextResponse.json(
      { error: "ไม่พบโปรไฟล์ติวเตอร์" },
      { status: 404 }
    );
  }

  try {
    const courses = await prisma.tutorCourse.findMany({
      where: { tutor_id: tutor.tutor_id },
      include: { subject: true },
      orderBy: { course_id: "desc" },
    });

    const formatted = courses.map((c) => ({
      course_id:          c.course_id,
      subject_id:         c.subject_id,         // อย่าลืมคืน subject_id ด้วย
      course_title:       c.course_title,
      subject_name:       c.subject?.name ?? "-",
      level:              c.level ?? "-",
      rate_per_hour:      c.rate_per_hour ?? 0,
      teaching_method:    c.teaching_method ?? "-",
      course_description: c.course_description ?? "",
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

// DELETE /api/tutor/[id]/courses/[course_id]
export async function DELETE(request, context) {
  const { params } = await context;
  const tutorUserId = parseInt(params.id, 10);
  const courseId    = parseInt(params.course_id, 10);
  if (isNaN(tutorUserId) || isNaN(courseId)) {
    return NextResponse.json(
      { error: "ID ไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  // ตรวจโปรไฟล์ติวเตอร์
  const tutor = await prisma.tutor.findUnique({
    where: { user_id: tutorUserId },
  });
  if (!tutor) {
    return NextResponse.json(
      { error: "ไม่พบโปรไฟล์ติวเตอร์" },
      { status: 404 }
    );
  }

  // ตรวจว่ามี booking อยู่หรือไม่
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
