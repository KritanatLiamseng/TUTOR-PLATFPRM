// src/app/api/bookings/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request) {
  const url     = new URL(request.url);
  const student = url.searchParams.get("student_id");
  const tutor   = url.searchParams.get("tutor_id");

  if (!student && !tutor) {
    return NextResponse.json(
      { error: "กรุณาระบุ student_id หรือ tutor_id ใน query string" },
      { status: 400 }
    );
  }

  const where = {};
  if (student) where.student_id = Number(student);
  if (tutor)   where.tutor_id   = Number(tutor);

  try {
    const rows = await prisma.booking.findMany({
      where,
      orderBy: { booking_date: "desc" },
      include: {
        student: {
          select: {
            user_id:       true,
            name:          true,
            surname:       true,
            profile_image: true,
          },
        },
        tutor: {
          select: {
            tutor_id: true,
            user: {
              select: {
                user_id: true,
                name:    true,
                surname: true,
              },
            },
          },
        },
        course: {
          select: {
            course_id:       true,
            course_title:    true,
            rate_per_hour:   true,
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
        booking_id:   b.booking_id,
        booking_date: b.booking_date,
        end_time:     b.end_time,
        status:       b.status,
        total_amount: b.total_amount,
        student: {
          user_id:       b.student.user_id,
          name:          b.student.name,
          surname:       b.student.surname,
          profile_image: b.student.profile_image,
        },
        tutor: {
          tutor_id: b.tutor.tutor_id,
          user: {
            user_id: b.tutor.user.user_id,
            name:    b.tutor.user.name,
            surname: b.tutor.user.surname,
          },
        },
        course: {
          course_id: b.course.course_id,
          title:     b.course.course_title,
          subject:   b.course.subject.name,
          rate:      b.course.rate_per_hour,
          method:    b.course.teaching_method,
        },
      }))
    );
  } catch (err) {
    console.error("❌ GET /api/bookings failed:", err);
    return NextResponse.json(
      { error: "ไม่สามารถโหลดประวัติการจองได้" },
      { status: 500 }
    );
  }
}
