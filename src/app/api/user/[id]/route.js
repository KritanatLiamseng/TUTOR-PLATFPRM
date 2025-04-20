
import prisma from "@/prisma/client";

export async function GET(req, context) {
  const id = context.params?.id;

  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: "ID ไม่ถูกต้อง" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(id, 10) },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "ไม่พบผู้ใช้" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🔥 Error:", err);
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
