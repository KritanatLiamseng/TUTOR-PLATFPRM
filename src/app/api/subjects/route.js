import prisma from "@/prisma/client";

export async function GET() {
  try {
    // เรียกใช้ prisma.subject (ไม่ใช่ prisma.subjects)
    const subjects = await prisma.subject.findMany({
      orderBy: { subject_id: "asc" },
    });
    return new Response(JSON.stringify(subjects), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 เกิดข้อผิดพลาด:", error);
    return new Response(
      JSON.stringify({ error: "โหลดรายวิชาไม่สำเร็จ" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
