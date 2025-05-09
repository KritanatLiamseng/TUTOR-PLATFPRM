import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// ✅ GET /api/admin-actions/bookings
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      where: { status: "confirmed" },
      include: {
        student: {
          select: { user: { select: { name: true, surname: true } } },
        },
        course: {
          select: {
            course_title: true,
            tutor: { select: { user: { select: { name: true, surname: true } } } },
          },
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (err) {
    console.error("❌ GET bookings (admin) failed:", err);
    return NextResponse.json({ error: "โหลดข้อมูลล้มเหลว" }, { status: 500 });
  }
}
