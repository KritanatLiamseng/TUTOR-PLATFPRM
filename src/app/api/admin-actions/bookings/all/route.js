// src/app/api/admin-actions/bookings/all/route.js

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { booking_date: "desc" },
      select: {
        booking_id: true,
        booking_date: true,
        total_amount: true,
        status: true,       // ← เพิ่มตรงนี้
        student: {
          select: { name: true, surname: true }
        },
        course: {
          select: {
            subject: { select: { name: true } },
            tutor: {
              select: {
                user: {
                  select: { name: true, surname: true }
                }
              }
            },
          },
        },
      },
    });
    return NextResponse.json(bookings);
  } catch (err) {
    console.error("❌ GET all bookings failed:", err);
    return NextResponse.json({ error: "โหลดข้อมูลทั้งหมดล้มเหลว" }, { status: 500 });
  }
}
