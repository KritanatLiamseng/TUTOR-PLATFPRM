import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(_request, context) {
  const id = Number(context.params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
      include: { payments: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "ไม่พบการจองนี้" }, { status: 404 });
    }

    const alreadyPaid = booking.payments.some(p => p.paid);
    if (alreadyPaid) {
      return NextResponse.json({ error: "มีการชำระเงินแล้ว" }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        booking_id: id,
        amount: booking.total_amount,
        payment_date: new Date(),
        paid: false, // ยังไม่จ่ายให้ติวเตอร์
        paid_at: null,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (err) {
    console.error("❌ POST /api/payments/[id]/pay failed:", err);
    return NextResponse.json({ error: "ชำระเงินไม่สำเร็จ" }, { status: 500 });
  }
}

