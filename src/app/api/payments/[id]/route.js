// src/app/api/payments/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request, { params }) {
  const bookingId = Number(params.id);
  if (Number.isNaN(bookingId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  // หา payment ที่ผูกกับ booking_id นี้
  const payment = await prisma.payment.findFirst({
    where: { booking_id: bookingId },
  });

  if (!payment) {
    return NextResponse.json(
      { error: "ไม่พบข้อมูลการชำระเงินสำหรับการจองนี้" },
      { status: 404 }
    );
  }

  return NextResponse.json(payment, { status: 200 });
}
