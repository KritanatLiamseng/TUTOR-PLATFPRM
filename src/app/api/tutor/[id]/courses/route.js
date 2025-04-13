import prisma from "@/prisma/client";

export async function PUT(req, { params }) {
  const { id } = params;
  let body;

  try {
    body = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "ไม่พบข้อมูลที่ส่งมา" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const updatedTutor = await prisma.tutor.update({
      where: { user_id: parseInt(id) },
      data: {
        experience_years: body.experience_years ?? undefined,
        available_time: body.available_time ?? undefined,
        rate_per_hour: body.rate_per_hour ?? undefined,
        subject_details: body.subject_details ?? undefined,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { user_id: parseInt(id) },
      data: {
        education_level: body.education_level ?? undefined,
      },
    });

    return new Response(JSON.stringify({
      message: "อัปเดตข้อมูลสำเร็จ",
      updatedTutor,
      updatedUser,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาดในการอัปเดต" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
