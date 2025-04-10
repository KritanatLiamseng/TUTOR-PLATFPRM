import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tutors = await prisma.tutor.findMany({
      where: { is_active: true },
      include: {
        user: {
          select: { name: true, username: true, email: true },
        },
      },
      take: 4, // จำกัดจำนวนแนะนำ
    });

    return NextResponse.json(tutors);
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return NextResponse.json({ error: "ไม่สามารถดึงข้อมูลติวเตอร์ได้" }, { status: 500 });
  }
}
