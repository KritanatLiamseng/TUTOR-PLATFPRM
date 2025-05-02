import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// DELETE /api/tutor/[id]/courses/[course_id]
export async function DELETE(request, { params }) {
  const userId   = parseInt(params.id, 10);
  const courseId = parseInt(params.course_id, 10);

  if (isNaN(userId) || isNaN(courseId)) {
    return NextResponse.json(
      { error: "ID ไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const tutor = await prisma.tutor.findUnique({
    where: { user_id: userId },
  });
  if (!tutor) {
    return NextResponse.json(
      { error: "ไม่พบโปรไฟล์ติวเตอร์" },
      { status: 404 }
    );
  }

  const existing = await prisma.tutorCourse.findUnique({
    where: { course_id: courseId },
  });
  if (!existing || existing.tutor_id !== tutor.tutor_id) {
    return NextResponse.json(
      { error: "ไม่พบคอร์สนี้" },
      { status: 404 }
    );
  }

  try {
    // ตรวจว่ามี booking อ้างอิงคอร์สนี้หรือไม่
    const bookingCount = await prisma.booking.count({
      where: { course_id: courseId },
    });
    if (bookingCount > 0) {
      return NextResponse.json(
        { error: "ไม่สามารถลบคอร์สที่มีการจองอยู่ได้" },
        { status: 409 }
      );
    }

    // ถ้าไม่มี booking ก็ลบได้
    await prisma.tutorCourse.delete({
      where: { course_id: courseId },
    });
    return NextResponse.json({
      message: "ลบคอร์สเรียบร้อยแล้ว"
    });
  } catch (err) {
    console.error("❌ ลบคอร์สล้มเหลว:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบคอร์ส" },
      { status: 500 }
    );
  }
}
