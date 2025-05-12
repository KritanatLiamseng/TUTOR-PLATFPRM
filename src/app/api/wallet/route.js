// src/app/api/wallet/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = Number(searchParams.get("user_id"));
  if (!uid || isNaN(uid)) {
    return NextResponse.json({ error: "user_id ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    // สมมติ wallet.balance = ยอดโอนเสร็จ (settled + completed)
    // และ wallet.pending = ยอดชำระแต่ยังไม่ settled
    const bookings = await prisma.booking.findMany({
      where: { tutor_id: uid },
      include: { payments: true },
    });

    let balance = 0;
    let pending = 0;
    for (const b of bookings) {
      // ดูสถานะแต่ละ booking
      if (b.status === "settled") {
        // ถ้า settled ถือว่าโอนเงินให้ tutor เรียบร้อย → เข้า balance
        balance += Number(b.total_amount);
      } else if (b.status === "completed") {
        // เรียนเสร็จ แต่ยังไม่โอน → pending
        pending += Number(b.total_amount);
      }
    }

    return NextResponse.json({ balance, pending });
  } catch (err) {
    console.error("❌ /api/wallet error:", err);
    return NextResponse.json({ error: "โหลดกระเป๋าเงินล้มเหลว" }, { status: 500 });
  }
}
