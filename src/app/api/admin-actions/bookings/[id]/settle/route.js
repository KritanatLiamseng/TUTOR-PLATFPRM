import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// ✅ POST /api/admin-actions/bookings/[id]/settle
export async function POST(request, contextPromise) {
  const { params } = await contextPromise;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    // 1) ตรวจสอบว่า booking อยู่ในสถานะ completed
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
      include: { payments: true },
    });
    if (!booking || booking.status !== "completed") {
      return NextResponse.json(
        { error: "การจองไม่อยู่ในสถานะที่โอนได้" },
        { status: 400 }
      );
    }

    // 2) อัปเดตสถานะ booking เป็น settled
    const updatedBooking = await prisma.booking.update({
      where: { booking_id: id },
      data: { status: "settled" },
    });

    // 3) อัปเดต payments ทั้งหมดของ booking นี้ให้ paid = true
    await prisma.payment.updateMany({
      where: {
        booking_id: id,
        paid: false,
      },
      data: {
        paid: true,
        paid_at: new Date(),
      },
    });

    // 4) คืนค่า booking ใหม่
    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (err) {
    console.error("❌ Error settling booking:", err);
    return NextResponse.json(
      { error: "อัปเดตสถานะไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
