// File: src/app/api/bookings/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// GET /api/bookings/:id
export async function GET(request, context) {
  // ต้อง await context ก่อน
  const { params } = await context;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
      include: {
        student: {
          select: {
            user: { select: { name: true, surname: true, profile_image: true } },
          },
        },
        course: {
          select: {
            course_title:    true,
            rate_per_hour:   true,
            teaching_method: true,
            subject:         { select: { name: true } },
            tutor: {
              select: {
                user: { select: { name: true, surname: true, profile_image: true } },
              },
            },
          },
        },
        payments: true,
        chats:    true,
      },
    });
    if (!booking) {
      return NextResponse.json({ error: "ไม่พบการจองนี้" }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "โหลดรายละเอียดไม่สำเร็จ" }, { status: 500 });
  }
}

// PUT /api/bookings/:id
export async function PUT(request, context) {
  const { params } = await context;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload ไม่เป็น JSON" }, { status: 400 });
  }

  // (แนะนำให้ validate body ก่อนอัปเดตจริง)
  try {
    const updated = await prisma.booking.update({
      where: { booking_id: id },
      data:  body,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "อัปเดตไม่สำเร็จ" }, { status: 500 });
  }
}

// DELETE /api/bookings/:id
export async function DELETE(request, context) {
  const { params } = await context;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }
  try {
    await prisma.booking.delete({ where: { booking_id: id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "ลบการจองไม่สำเร็จ" }, { status: 500 });
  }
}
