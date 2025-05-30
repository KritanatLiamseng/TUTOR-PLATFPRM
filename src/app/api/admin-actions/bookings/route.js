// src/app/api/admin-actions/bookings/route.js

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: "completed",       // นักเรียนกด “เรียนเสร็จแล้ว” แล้ว
        payments: {
          some: { paid: true }     // และมี payment ที่ paid = true
        },
      },
      orderBy: { booking_date: "desc" },
      select: {
        booking_id: true,
        booking_date: true,
        total_amount: true,
        student: {
          select: { name: true, surname: true }
        },
        course: {
          select: {
            course_title: true,
            tutor: {
              select: {
                user: {
                  select: { name: true, surname: true }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(bookings);
  } catch (err) {
    console.error("❌ GET bookings (admin) failed:", err);
    return NextResponse.json(
      { error: "โหลดข้อมูลล้มเหลว" },
      { status: 500 }
    );
  }
}
