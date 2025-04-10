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
      orderBy: {
        tutor_id: "asc",
      },
      take: 6, // แสดงเฉพาะ 6 คนแรก
    });

    // แปลงให้ Frontend ใช้ง่ายขึ้น
    const formatted = tutors.map((tutor) => ({
      name: tutor.user?.name || "-",
      subject: tutor.bio || "ไม่ระบุวิชา",
      experience_years: tutor.experience_years || 0,
      price: tutor.rate_per_hour || 0,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("โหลดรายชื่อติวเตอร์ล้มเหลว:", error);
    return NextResponse.json(
      { error: "ไม่สามารถโหลดข้อมูลติวเตอร์ได้" },
      { status: 500 }
    );
  }
}
