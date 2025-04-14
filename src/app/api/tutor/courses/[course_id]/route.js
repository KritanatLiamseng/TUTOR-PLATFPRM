import prisma from "@/prisma/client";

export async function DELETE(req, { params }) {
  const { course_id } = params;

  try {
    await prisma.tutor_courses.delete({
      where: {
        course_id: parseInt(course_id, 10),
      },
    });

    return new Response(JSON.stringify({ message: "ลบคอร์สเรียบร้อยแล้ว" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ ลบคอร์สล้มเหลว:", error);
    return new Response(JSON.stringify({ error: "ไม่สามารถลบคอร์สได้" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
