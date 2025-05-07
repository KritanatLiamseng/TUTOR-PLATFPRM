import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

// GET /api/bookings?tutor_id=… or /api/bookings?student_id=…
export async function GET(request) {
  const url = new URL(request.url);
  const student_id = url.searchParams.get("student_id");
  const tutor_id   = url.searchParams.get("tutor_id");

  // ต้องระบุอย่างใดอย่างหนึ่ง
  if (!student_id && !tutor_id) {
    return NextResponse.json(
      { error: "ต้องระบุ student_id หรือ tutor_id ใน query string" },
      { status: 400 }
    );
  }

  const where = {};
  if (student_id) where.student_id = Number(student_id);
  if (tutor_id)   where.tutor_id   = Number(tutor_id);

  try {
    const rows = await prisma.booking.findMany({
      where,
      orderBy: { booking_date: "desc" },
      include: {
        course: {
          select: {
            course_id:      true,
            course_title:   true,
            rate_per_hour:  true,
            teaching_method:true,
            subject:        { select: { name: true } },
          },
        },
        student: {
          select: {
            user_id:       true,
            name:          true,
            surname:       true,
            profile_image: true,
          },
        },
      },
    });

    const formatted = rows.map((b) => ({
      booking_id:    b.booking_id,
      booking_date:  b.booking_date,
      status:        b.status,
      total_amount:  b.total_amount,
      course: {
        course_id:    b.course.course_id,
        title:        b.course.course_title,
        subject_name: b.course.subject.name,
        rate:         b.course.rate_per_hour,
        method:       b.course.teaching_method,
      },
      student: {
        user_id:       b.student.user_id,
        name:          b.student.name,
        surname:       b.student.surname,
        profile_image: b.student.profile_image,
      },
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("❌ GET /api/bookings failed:", err);
    return NextResponse.json(
      { error: "ไม่สามารถโหลดการจองได้" },
      { status: 500 }
    );
  }
}
