// src/app/api/tutors/route.js
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tutors = await prisma.tutor.findMany({
      where: { is_active: true },
      include: {
        user: {
          select: {
            name: true,
            profile_image: true,
          },
        },
      },
      orderBy: { tutor_id: "asc" },
      take: 6, // ← เอาออกหรือปรับตามต้องการ
    });

    const formatted = tutors.map((t) => ({
      id:               t.tutor_id,
      name:             t.user?.name ?? "-",
      bio:              t.bio ?? "ไม่ระบุ",           // ← เปลี่ยนจาก subject
      rate_per_hour:    t.rate_per_hour ?? 0,
      rating_average:   t.rating_average ?? 0,
      profile_image:    t.user?.profile_image ?? null,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("❌ โหลดติวเตอร์ล้มเหลว:", error);
    return NextResponse.json(
      { error: "ไม่สามารถโหลดข้อมูลติวเตอร์ได้" },
      { status: 500 }
    );
  }
}
