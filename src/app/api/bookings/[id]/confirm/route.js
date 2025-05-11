// src/app/api/bookings/[id]/confirm/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request, context) {
  const { params } = await context;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const updated = await prisma.booking.update({
      where: { booking_id: id },
      data: { status: "confirmed" },
    });
    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "ยืนยันการจองไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
