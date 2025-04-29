import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const all = await prisma.booking.findMany({
      include: {
        student: { select: { user_id: true, name: true } },
        tutor: {
          select: {
            tutor_id: true,
            user: { select: { name: true } },
          },
        },
        course: { select: { course_id: true, course_title: true } },
      },
      orderBy: { booking_date: "desc" },
    });
    return NextResponse.json(all);
  } catch (err) {
    console.error("❌ GET /api/bookings failed:", err);
    return NextResponse.json({ error: "ไม่สามารถดึงข้อมูลการจองได้" }, { status: 500 });
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload ไม่ใช่ JSON" }, { status: 400 });
  }

  const { student_id, tutor_id, course_id, booking_date, total_amount } = body;
  if (![student_id, tutor_id, course_id, booking_date, total_amount].every(Boolean)) {
    return NextResponse.json({ error: "ข้อมูลจองไม่ครบ" }, { status: 422 });
  }

  try {
    const created = await prisma.booking.create({
      data: {
        student_id:   Number(student_id),
        tutor_id:     Number(tutor_id),
        course_id:    Number(course_id),
        booking_date: new Date(booking_date),
        total_amount: Number(total_amount),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("❌ POST /api/bookings failed:", err);
    return NextResponse.json({ error: "ไม่สามารถสร้างการจองได้" }, { status: 500 });
  }
}
