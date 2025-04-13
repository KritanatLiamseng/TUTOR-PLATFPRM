import prisma from "@/prisma/client";

export async function GET(req, context) {
  const { id } = context.params; // ✅ ต้องดึง params แบบนี้

  console.log("📥 ได้รับ id จาก params:", id);

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(id, 10) },
    });

    console.log("🔍 ผลลัพธ์จาก prisma:", user);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "ไม่พบผู้ใช้" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 Error:", error);

    return new Response(
      JSON.stringify({ error: "เกิดข้อผิดพลาดที่ server" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
