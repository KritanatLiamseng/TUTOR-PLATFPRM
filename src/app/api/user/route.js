// src/app/api/user/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const dynamic = "force-dynamic";

// GET /api/user?role=student|tutor
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  if (!role || !["student", "tutor"].includes(role)) {
    return NextResponse.json(
      { error: "role ต้องเป็น student หรือ tutor เท่านั้น" },
      { status: 400 }
    );
  }

  try {
    const users = await prisma.user.findMany({
      where: { role },
      select: role === "tutor"
        ? {
            user_id:       true,
            name:          true,
            surname:       true,
            profile_image: true,
            tutor: {
              select: {
                bank_name:           true,
                bank_account_number: true,
                bank_account_name:   true,
              },
            },
          }
        : {
            user_id:       true,
            name:          true,
            surname:       true,
            profile_image: true,
          },
      orderBy: { user_id: "asc" },
    });
    return NextResponse.json(users);
  } catch (err) {
    console.error("❌ ดึงรายชื่อผู้ใช้ล้มเหลว:", err);
    return NextResponse.json(
      { error: "โหลดข้อมูลผู้ใช้ไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
