import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// ✅ POST /api/bookings/[id]/pay
export async function POST(request, contextPromise) {
  const { params } = await contextPromise;
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
    });

    if (!booking) {
      return NextResponse.json({ error: "ไม่พบการจองนี้" }, { status: 404 });
    }

    if (booking.status !== "confirmed") {
      return NextResponse.json({ error: "สถานะต้องเป็น confirmed ก่อนชำระเงิน" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { booking_id: id },
      data: { status: "paid" },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    console.error("❌ Payment update failed:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดขณะชำระเงิน" }, { status: 500 });
  }
}
