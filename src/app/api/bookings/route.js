// File: src/app/api/bookings/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Payload ไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const student_id  = Number(body.student_id);
  const course_id   = Number(body.course_id);
  const booking_date = new Date(body.booking_date);
  if (!student_id || !course_id || isNaN(booking_date.getTime())) {
    return NextResponse.json(
      { error: "ข้อมูลไม่ครบถ้วนหรือรูปแบบวันเวลาไม่ถูกต้อง" },
      { status: 422 }
    );
  }

  const course = await prisma.tutorCourse.findUnique({
    where: { course_id },
  });
  if (!course) {
    return NextResponse.json(
      { error: "ไม่พบคอร์สนี้" },
      { status: 404 }
    );
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        student_id,
        course_id:    course.course_id,
        tutor_id:     course.tutor_id,
        booking_date,              // ใช้วันเวลาจาก form
        status:       "pending",
        total_amount: course.rate_per_hour,
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    console.error("❌ สร้างการจองล้มเหลว:", err);
    return NextResponse.json(
      { error: "ไม่สามารถจองได้ โปรดลองใหม่" },
      { status: 500 }
    );
  }
}
