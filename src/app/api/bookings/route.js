// File: /api/bookings/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const dynamic = "force-dynamic";

// ✅ GET /api/bookings?user_id=...
export async function GET(request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json(
      { error: "กรุณาระบุ user_id ใน query string" },
      { status: 400 }
    );
  }

  const uid = Number(userId);
  if (Number.isNaN(uid)) {
    return NextResponse.json(
      { error: "user_id ต้องเป็นตัวเลข" },
      { status: 400 }
    );
  }

  try {
    const tutor = await prisma.tutor.findUnique({
      where: { user_id: uid },
      select: { tutor_id: true },
    });

    const rows = await prisma.booking.findMany({
      where: {
        OR: [
          { student_id: uid },
          ...(tutor ? [{ tutor_id: tutor.tutor_id }] : []),
        ],
      },
      orderBy: { booking_date: "desc" },
      include: {
        student: {
          select: {
            user_id: true,
            name: true,
            surname: true,
            profile_image: true,
          },
        },
        tutor: {
          select: {
            tutor_id: true,
            user: {
              select: {
                user_id: true,
                name: true,
                surname: true,
                profile_image: true,
              },
            },
          },
        },
        course: {
          select: {
            course_id: true,
            course_title: true,
            rate_per_hour: true,
            teaching_method: true,
            subject: {
              select: { name: true },
            },
          },
        },
      },
    });

    const result = rows.map((b) => ({
      booking_id: b.booking_id,
      booking_date: b.booking_date,
      status: b.status,
      total_amount: b.total_amount,
      student: b.student,
      tutor: b.tutor,
      course: {
        course_id: b.course?.course_id ?? 0,
        title: b.course?.course_title ?? "ไม่ระบุชื่อคอร์ส",
        subject: b.course?.subject?.name ?? "-",
        rate: b.course?.rate_per_hour ?? 0,
        method: b.course?.teaching_method ?? "-",
      },
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ GET /api/bookings failed:", err);
    return NextResponse.json(
      { error: "ไม่สามารถโหลดประวัติการจองได้", detail: err?.message ?? "unknown" },
      { status: 500 }
    );
  }
}

// ✅ POST /api/bookings
export async function POST(request) {
  try {
    const body = await request.json();
    const { student_id, tutor_id, course_id, booking_date, end_time, total_amount } = body;

    if (!student_id || !tutor_id || !course_id || !booking_date || !end_time || typeof total_amount !== "number") {
      return NextResponse.json(
        { error: "กรุณาระบุข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        student_id: Number(student_id),
        tutor_id: Number(tutor_id),
        course_id: Number(course_id),
        booking_date: new Date(booking_date),
        start_time: new Date(booking_date),
        end_time: new Date(end_time),
        total_amount: Number(total_amount),
        status: "pending",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    console.error("❌ POST /api/bookings failed:", err);
    return NextResponse.json(
      { error: "จองไม่สำเร็จ", detail: err?.message ?? "unknown" },
      { status: 500 }
    );
  }
}
