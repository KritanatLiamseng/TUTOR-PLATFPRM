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
    });

    const formatted = tutors.map((tutor) => ({
      name: tutor.user?.name ?? "-",
      subject: tutor.bio ?? "ไม่ระบุวิชา",
      experience_years: tutor.experience_years ?? 0,
      rate_per_hour: tutor.rate_per_hour ?? 0,
      rating_average: tutor.rating_average ?? 0,
      profile_image: tutor.user?.profile_image ?? null,
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
