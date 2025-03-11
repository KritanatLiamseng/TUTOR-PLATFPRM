import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "ไม่พบชื่อผู้ใช้นี้" }), {
        status: 404,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "รหัสผ่านไม่ถูกต้อง" }), {
        status: 401,
      });
    }

    return new Response(
      JSON.stringify({ success: "เข้าสู่ระบบสำเร็จ", role: user.role }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
}
