// src/app/api/bookings/[id]/complete/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request, { params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    // ตรวจสอบก่อนว่ามี booking นี้หรือไม่
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
      include: { payments: true },
    });
    if (!booking) {
      return NextResponse.json({ error: "ไม่พบการจองนี้" }, { status: 404 });
    }

    // ต้องเป็น confirmed และจ่ายเงินแล้ว (paid=true)
    const hasPaid = booking.payments.some((p) => p.paid);
    if (booking.status !== "confirmed" || !hasPaid) {
      return NextResponse.json(
        { error: "สถานะไม่พร้อมสำหรับทำเครื่องหมายเรียนเสร็จ" },
        { status: 400 }
      );
    }

    // อัปเดต booking → completed
    const updated = await prisma.booking.update({
      where: { booking_id: id },
      data: { status: "completed" },
    });

    // โอนเงินให้ติวเตอร์ (mock) โดยอัปเดต payments
    await prisma.payment.updateMany({
      where: { booking_id: id, paid: false },
      data: { paid: true, paid_at: new Date() },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    console.error("❌ Complete route error:", err);
    return NextResponse.json(
      { error: "อัปเดตสถานะไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
