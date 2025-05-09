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
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
    });

    if (!booking || booking.status !== "completed") {
      return NextResponse.json(
        { error: "การจองไม่อยู่ในสถานะที่โอนได้" },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { booking_id: id },
      data: { status: "settled" },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    console.error("❌ Error settling booking:", err);
    return NextResponse.json({ error: "อัปเดตสถานะไม่สำเร็จ" }, { status: 500 });
  }
}
