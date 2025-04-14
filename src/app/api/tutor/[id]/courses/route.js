import prisma from "@/prisma/client";

export async function GET(req, { params }) {
  const tutorId = parseInt(params.id);

  try {
    const courses = await prisma.tutor_courses.findMany({
      where: { tutor_id: tutorId },
      include: { subject: true },
    });

    const formatted = courses.map(course => ({
      course_id: course.course_id,
      level: course.level,
      description: course.description,
      subject_name: course.subject.name,
    }));

    return new Response(JSON.stringify(formatted), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("📛 ERROR:", err);
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด" }), {
      status: 500,
    });
  }
}
