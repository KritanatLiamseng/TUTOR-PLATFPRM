// src/app/api/tutor-actions/bookings/route.js

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request) {
  // ดึง tutor user ID จาก query string
  const { searchParams } = new URL(request.url);
  const uid = Number(searchParams.get("user_id"));
  if (Number.isNaN(uid)) {
    return NextResponse.json(
      { error: "user_id ไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        // คิวรีเฉพาะคอร์สที่ tutor นี้รับสอน และยังไม่ถูกยกเลิก
        course: {
          tutor: {
            user_id: uid,
          },
        },
        status: { not: "cancelled" },
      },
      orderBy: { booking_date: "desc" },
      select: {
        booking_id: true,
        booking_date: true,
        total_amount: true,
        status: true,
        // ข้อมูล student
        student: {
          select: {
            name: true,
            surname: true,
            profile_image: true,
          },
        },
        // ข้อมูลคอร์สและวิชา
        course: {
          select: {
            course_title: true,
            subject: { select: { name: true } },
          },
        },
      },
    });

    // ขอให้ front-end ได้ student, course, booking_date, total_amount, status ตรงๆ
    return NextResponse.json(bookings);
  } catch (err) {
    console.error("❌ GET tutor bookings failed:", err);
    return NextResponse.json(
      { error: "โหลดประวัติการจองล้มเหลว" },
      { status: 500 }
    );
  }
}
