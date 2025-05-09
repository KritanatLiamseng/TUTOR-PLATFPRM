import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PATCH(request, { params }) {
  const bookingId = Number(params.id);

  if (Number.isNaN(bookingId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const updated = await prisma.booking.update({
      where: { booking_id: bookingId },
      data: { status: "confirmed" },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ ยืนยันล้มเหลว:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
