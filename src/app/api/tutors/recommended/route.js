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
            username: true,
            email: true,
            profile_image: true,
          },
        },
      },
      orderBy: {
        tutor_id: "asc",
      },
      take: 4, // จำกัดจำนวน
    });

    const formatted = tutors.map((tutor) => ({
      name: tutor.user?.name ?? "-",
      username: tutor.user?.username ?? "",
      email: tutor.user?.email ?? "",
      profile_image: tutor.user?.profile_image ?? null,
      bio: tutor.bio ?? "ไม่ระบุ",
      experience_years: tutor.experience_years ?? 0,
      rate_per_hour: tutor.rate_per_hour ?? 0,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("❌ โหลดติวเตอร์ล้มเหลว:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลติวเตอร์ได้" },
      { status: 500 }
    );
  }
}
