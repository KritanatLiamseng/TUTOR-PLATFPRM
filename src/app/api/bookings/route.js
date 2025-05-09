import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const dynamic = "force-dynamic";

// ✅ GET /api/bookings?student_id=...&tutor_id=...
export async function GET(request, { params }) {
  const url = new URL(request.url);
  const student = url.searchParams.get("student_id");
  const tutor = url.searchParams.get("tutor_id");

  if (!student && !tutor) {
    return NextResponse.json(
      { error: "กรุณาระบุ student_id หรือ tutor_id ใน query string" },
      { status: 400 }
    );
  }

  const where = {};
  if (student) where.student_id = Number(student);
  if (tutor) where.tutor_id = Number(tutor);

  try {
    const rows = await prisma.booking.findMany({
      where,
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

    return NextResponse.json(
      rows.map((b) => ({
        booking_id: b.booking_id,
        booking_date: b.booking_date,
        status: b.status,
        total_amount: b.total_amount,
        student: b.student,
        tutor: b.tutor,
        course: {
          course_id: b.course.course_id,
          title: b.course.course_title,
          subject: b.course.subject?.name || "-",
          rate: b.course.rate_per_hour,
          method: b.course.teaching_method,
        },
      }))
    );
  } catch (err) {
    console.error("❌ GET /api/bookings failed:", err);
    return NextResponse.json({ error: "ไม่สามารถโหลดประวัติการจองได้" }, { status: 500 });
  }
}

// ✅ POST /api/bookings
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "ข้อมูล JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const {
    student_id,
    tutor_id,
    course_id,
    booking_date,
    total_amount,
  } = body;

  if (!student_id || !tutor_id || !course_id || !booking_date || !total_amount) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 422 });
  }

  try {
    const newBooking = await prisma.booking.create({
      data: {
        student_id: Number(student_id),
        tutor_id: Number(tutor_id),
        course_id: Number(course_id),
        booking_date: new Date(booking_date),
        total_amount: Number(total_amount),
        status: "pending",
      },
    });

    return NextResponse.json(newBooking);
  } catch (err) {
    console.error("❌ POST /api/bookings failed:", err);
    return NextResponse.json({ error: "ไม่สามารถสร้างการจองได้" }, { status: 500 });
  }
}
