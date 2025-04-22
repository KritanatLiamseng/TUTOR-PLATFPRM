import prisma from "@/prisma/client";

export async function GET(req, context) {
  const params = await context.params; // 🟢 ต้อง await ก่อน
  const id = params?.id;

  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: "ID ไม่ถูกต้อง" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const courses = await prisma.tutor_courses.findMany({
      where: { tutor_id: parseInt(id, 10) },
      include: { subject: true },
    });

    const formatted = courses.map((course) => ({
      course_id: course.course_id,
      course_title: course.course_title,
      level: course.level,
      rate_per_hour: course.rate_per_hour,
      teaching_method: course.teaching_method,
      course_description: course.course_description,
      subject_name: course.subject?.name ?? "ไม่ระบุวิชา",
    }));

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ ดึงคอร์สล้มเหลว:", err);
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาดในการโหลดคอร์ส" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
