import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// DELETE /api/tutor/[id]/courses/[course_id]
export async function DELETE(request, context) {
  const params = await context.params;
  const userId   = parseInt(params.id,        10);
  const courseId = parseInt(params.course_id, 10);

  if (isNaN(userId) || isNaN(courseId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  // ตรวจว่ามีโปรไฟล์ติวเตอร์
  const tutor = await prisma.tutor.findUnique({ where: { user_id: userId } });
  if (!tutor) {
    return NextResponse.json({ error: "ไม่พบโปรไฟล์ติวเตอร์" }, { status: 404 });
  }

  // ตรวจว่าเป็นคอร์สของติวเตอร์คนนี้
  const existing = await prisma.tutorCourse.findUnique({
    where: { course_id: courseId },
  });
  if (!existing || existing.tutor_id !== tutor.tutor_id) {
    return NextResponse.json({ error: "ไม่พบคอร์สนี้" }, { status: 404 });
  }

  try {
    // ถ้ายังมี booking อ้างอิงอยู่ จะลบไม่ได้
    const bookingCount = await prisma.booking.count({
      where: { course_id: courseId },
    });
    if (bookingCount > 0) {
      return NextResponse.json(
        { error: "ไม่สามารถลบคอร์สที่มีการจองอยู่ได้" },
        { status: 409 }
      );
    }

    // ถ้าไม่มี booking แล้ว ให้ลบ
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
