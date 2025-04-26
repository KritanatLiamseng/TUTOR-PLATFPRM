import prisma from "@/prisma/client";

export async function GET(req, context) {
  // ✨ ดึงทั้ง 2 params จาก URL
  const { id: userIdParam, course_id: courseIdParam } = await context.params;
  const userId   = Number(userIdParam);
  const courseId = Number(courseIdParam);

  if (isNaN(userId) || isNaN(courseId)) {
    return new Response(
      JSON.stringify({ error: "ID ไม่ถูกต้อง" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // หา tutor จาก user_id
  const tutor = await prisma.tutor.findUnique({
    where: { user_id: userId },
  });
  if (!tutor) {
    return new Response(
      JSON.stringify({ error: "ไม่พบโปรไฟล์ติวเตอร์" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // หา course เดี่ยว (ตรวจ tutor_id ด้วย)
  const course = await prisma.tutor_courses.findUnique({
    where: { course_id: courseId },
  });
  if (!course || course.tutor_id !== tutor.tutor_id) {
    return new Response(
      JSON.stringify({ error: "ไม่พบคอร์สนี้" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify(course), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(req, context) {
  const { id: userIdParam, course_id: courseIdParam } = await context.params;
  const userId   = Number(userIdParam);
  const courseId = Number(courseIdParam);

  if (isNaN(userId) || isNaN(courseId)) {
    return new Response(
      JSON.stringify({ error: "ID ไม่ถูกต้อง" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const tutor = await prisma.tutor.findUnique({ where: { user_id: userId } });
  if (!tutor) {
    return new Response(
      JSON.stringify({ error: "ไม่พบโปรไฟล์ติวเตอร์" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "JSON payload ไม่ถูกต้อง" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { subject_id, course_title, rate_per_hour } = body;
  if (!subject_id || !course_title || !rate_per_hour) {
    return new Response(
      JSON.stringify({ error: "ข้อมูลไม่ครบถ้วน" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  // ตรวจความเป็นเจ้าของคอร์ส
  const existing = await prisma.tutor_courses.findUnique({ where: { course_id: courseId } });
  if (!existing || existing.tutor_id !== tutor.tutor_id) {
    return new Response(
      JSON.stringify({ error: "ไม่พบคอร์สนี้" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const updated = await prisma.tutor_courses.update({
      where: { course_id: courseId },
      data: {
        subject_id:        Number(subject_id),
        course_title:      body.course_title,
        course_description: body.course_description ?? "",
        rate_per_hour:     Number(body.rate_per_hour),
        teaching_method:   body.teaching_method ?? "",
        level:             body.level ?? "",
      },
    });
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ อัปเดตคอร์สล้มเหลว:", err);
    return new Response(
      JSON.stringify({ error: "เกิดข้อผิดพลาดในการอัปเดต" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req, context) {
  const { id: userIdParam, course_id: courseIdParam } = await context.params;
  const userId   = Number(userIdParam);
  const courseId = Number(courseIdParam);

  if (isNaN(userId) || isNaN(courseId)) {
    return new Response(
      JSON.stringify({ error: "ID ไม่ถูกต้อง" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const tutor = await prisma.tutor.findUnique({ where: { user_id: userId } });
  if (!tutor) {
    return new Response(
      JSON.stringify({ error: "ไม่พบโปรไฟล์ติวเตอร์" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const existing = await prisma.tutor_courses.findUnique({ where: { course_id: courseId } });
  if (!existing || existing.tutor_id !== tutor.tutor_id) {
    return new Response(
      JSON.stringify({ error: "ไม่พบคอร์สนี้" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    await prisma.tutor_courses.delete({ where: { course_id: courseId } });
    return new Response(JSON.stringify({ message: "ลบคอร์สเรียบร้อย" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ ลบคอร์สล้มเหลว:", err);
    return new Response(
      JSON.stringify({ error: "เกิดข้อผิดพลาดในการลบคอร์ส" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
