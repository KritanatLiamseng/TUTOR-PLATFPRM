import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// DELETE /api/tutor/[id]/courses/[course_id]
export async function DELETE(request, context) {
  const { id, course_id } = await context.params;
  const userId   = Number(id);
  const courseId = Number(course_id);

  if (isNaN(userId) || isNaN(courseId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  // ตรวจว่าเป็น tutor จริง
  const tutor = await prisma.tutor.findUnique({ where: { user_id: userId } });
  if (!tutor) {
    return NextResponse.json({ error: "ไม่พบโปรไฟล์ติวเตอร์" }, { status: 404 });
  }

  // ตรวจว่าคอร์สเป็นของ tutor คนนี้
  const existing = await prisma.tutorCourse.findUnique({
    where: { course_id: courseId },
  });
  if (!existing || existing.tutor_id !== tutor.tutor_id) {
    return NextResponse.json({ error: "ไม่พบคอร์สนี้" }, { status: 404 });
  }

  try {
    // เพียงสั่งลบ Prisma จะใช้ onDelete: Cascade ที่เราเซ็ตใน schema
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
