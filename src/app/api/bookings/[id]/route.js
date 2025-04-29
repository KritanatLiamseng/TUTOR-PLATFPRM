import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }
  try {
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
      include: {
        student: { select: { user_id: true, name: true } },
        tutor: {
          select: {
            tutor_id: true,
            user: { select: { name: true } },
          },
        },
        course: true,
        payments: true,
        chats: true,
      },
    });
    if (!booking) {
      return NextResponse.json({ error: "ไม่พบการจองนี้" }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (err) {
    console.error(`❌ GET /api/bookings/${id} failed:`, err);
    return NextResponse.json({ error: "โหลดรายละเอียดไม่สำเร็จ" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload ไม่ใช่ JSON" }, { status: 400 });
  }

  try {
    const updated = await prisma.booking.update({
      where: { booking_id: id },
      data: body, // ควร validate เฉพาะฟิลด์ที่อนุญาตอัพเดต
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(`❌ PUT /api/bookings/${id} failed:`, err);
    return NextResponse.json({ error: "อัพเดตข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }
  try {
    await prisma.booking.delete({ where: { booking_id: id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`❌ DELETE /api/bookings/${id} failed:`, err);
    return NextResponse.json({ error: "ลบการจองไม่สำเร็จ" }, { status: 500 });
  }
}
