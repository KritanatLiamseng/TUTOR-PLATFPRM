import prisma from "@/prisma/client";

export async function POST(req, context) {
  const { id } = context.params; // ✅ ถูกต้องแล้วแบบนี้
  const tutor_id = parseInt(id, 10);
  const body = await req.json();

  try {
    const {
      subject_id,
      course_title,
      course_description,
      rate_per_hour,
      teaching_method,
      level,
    } = body;

    if (!subject_id || !course_title || !rate_per_hour || !teaching_method || !level) {
      return new Response(JSON.stringify({ error: "ข้อมูลไม่ครบถ้วน" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newCourse = await prisma.tutor_courses.create({
      data: {
        tutor_id,
        subject_id: parseInt(subject_id),
        course_title,
        course_description,
        rate_per_hour: parseFloat(rate_per_hour),
        teaching_method,
        level,
      },
    });

    return new Response(JSON.stringify(newCourse), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ เพิ่มคอร์สล้มเหลว:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
