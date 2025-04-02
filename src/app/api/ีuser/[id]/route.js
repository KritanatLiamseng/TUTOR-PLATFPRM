import prisma from "@/prisma/client";
import axios from "axios";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(id) },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "ไม่พบผู้ใช้" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด" }), { status: 500 });
  }
}
