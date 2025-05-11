import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(_req, { params }) {
  const bookingId = Number(params.booking_id);
  if (Number.isNaN(bookingId)) {
    return NextResponse.json({ error: "Booking ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { booking_id: bookingId },
      include: { payments: true },
    });

    if (!booking || booking.status !== "confirmed") {
      return NextResponse.json({ error: "ไม่สามารถขอคืนเงินได้ในสถานะนี้" }, { status: 400 });
    }

    const payment = booking.payments.find(p => p.paid);
    if (!payment) {
      return NextResponse.json({ error: "ยังไม่มีการชำระเงิน" }, { status: 400 });
    }

    // Mock refund: ยกเลิก payment
    await prisma.payment.update({
      where: { payment_id: payment.payment_id },
      data: { paid: false, paid_at: null },
    });

    await prisma.booking.update({
      where: { booking_id: bookingId },
      data: { status: "cancelled" },
    });

    return NextResponse.json({ success: true, message: "ดำเนินการคืนเงินแล้ว" });
  } catch (err) {
    console.error("❌ REFUND failed:", err);
    return NextResponse.json({ error: "ไม่สามารถคืนเงินได้" }, { status: 500 });
  }
}
