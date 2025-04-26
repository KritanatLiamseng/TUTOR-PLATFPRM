import prisma from "@/prisma/client";

export async function GET(req, context) {
  // ถอดค่า user_id จาก path params
  const params = await context.params;
  const userId = Number(params.id);

  // ตรวจสอบ userId
  if (isNaN(userId)) {
    return new Response(
      JSON.stringify({ error: "ID ไม่ถูกต้อง" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // หาโปรไฟล์ติวเตอร์ตาม user_id
  const tutor = await prisma.tutor.findUnique({
    where: { user_id: userId },
  });
  if (!tutor) {
    return new Response(
      JSON.stringify({ error: "ไม่พบโปรไฟล์ติวเตอร์" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // ดึงคอร์สทั้งหมดของติวเตอร์
    const courses = await prisma.tutor_courses.findMany({
      where: { tutor_id: tutor.tutor_id },
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
    return new Response(
      JSON.stringify({ error: "เกิดข้อผิดพลาดในการโหลดคอร์ส" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req, context) {
  // ถอดค่า user_id จาก path params
  const params = await context.params;
  const userId = Number(params.id);

  // ตรวจสอบ userId
  if (isNaN(userId)) {
    return new Response(
      JSON.stringify({ error: "ID ไม่ถูกต้อง" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // หาโปรไฟล์ติวเตอร์ตาม user_id
  const tutor = await prisma.tutor.findUnique({
    where: { user_id: userId },
  });
  if (!tutor) {
    return new Response(
      JSON.stringify({ error: "ไม่พบโปรไฟล์ติวเตอร์" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // อ่าน body และ validate
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "JSON payload ไม่ถูกต้อง" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const {
    subject_id,
    course_title,
    course_description,
    rate_per_hour,
    teaching_method,
    level,
  } = body;

  if (!subject_id || !course_title || !rate_per_hour) {
    return new Response(
      JSON.stringify({ error: "ข้อมูลคอร์สไม่ครบถ้วน" }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // สร้างคอร์สใหม่โดยใช้ tutor_id ที่เจอมา
    const newCourse = await prisma.tutor_courses.create({
      data: {
        tutor_id: tutor.tutor_id,
        subject_id: Number(subject_id),
        course_title,
        course_description: course_description ?? "",
        rate_per_hour: Number(rate_per_hour),
        teaching_method: teaching_method ?? "",
        level: level ?? "",
      },
    });

    return new Response(JSON.stringify(newCourse), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ สร้างคอร์สล้มเหลว:", err);
    return new Response(
      JSON.stringify({ error: "เกิดข้อผิดพลาดในการสร้างคอร์ส" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
