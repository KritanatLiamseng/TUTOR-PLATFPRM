import prisma from "@/prisma/client";

export async function POST(req, { params }) {
  const { id } = params;
  const body = await req.json();

  try {
    const newCourse = await prisma.tutor_courses.create({
      data: {
        user_id: parseInt(id),
        subject_id: parseInt(body.subject_id),
        level: body.level,
        description: body.description,
      },
    });

    return new Response(JSON.stringify(newCourse), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);
    return new Response(JSON.stringify({ error: "ไม่สามารถเพิ่มคอร์สได้" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
