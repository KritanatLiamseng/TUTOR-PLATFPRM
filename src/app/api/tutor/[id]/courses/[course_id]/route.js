import prisma from "@/prisma/client";

export async function DELETE(req, { params }) {
  const course_id = parseInt(params.course_id);

  try {
    await prisma.tutor_courses.delete({ where: { course_id } });
    return new Response(JSON.stringify({ message: "ลบคอร์สเรียบร้อย" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(req, { params }) {
  const course_id = parseInt(params.course_id);
  const data = await req.json();

  try {
    const updated = await prisma.tutor_courses.update({
      where: { course_id },
      data: {
        subject_id: parseInt(data.subject_id),
        course_title: data.course_title,
        course_description: data.course_description,
        rate_per_hour: parseFloat(data.rate_per_hour),
        teaching_method: data.teaching_method,
        level: data.level,
      },
    });

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}