// File: src/app/api/bookings/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

// ✅ GET /api/bookings/[id]
export async function GET(_request, contextPromise) {
  const { params } = await contextPromise;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
      include: {
        student: {
          select: {
            name: true,
            surname: true,
            profile_image: true,
          },
        },
        course: {
          select: {
            course_title: true,
            rate_per_hour: true,
            teaching_method: true,
            subject: {
              select: { name: true },
            },
            tutor: {
              select: {
                user: {
                  select: {
                    name: true,
                    surname: true,
                    profile_image: true,
                  },
                },
              },
            },
          },
        },
        payments: true,   // เอา chats ออก เหลือแค่ payments
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "ไม่พบการจองนี้" }, { status: 404 });
    }

    const result = {
      ...booking,
      course: {
        ...booking.course,
        subject: booking.course.subject?.name ?? "-",
        tutor: {
          name: booking.course.tutor?.user?.name ?? "",
          surname: booking.course.tutor?.user?.surname ?? "",
          profile_image: booking.course.tutor?.user?.profile_image ?? null,
        },
      },
      payments: booking.payments.map(p => ({
        ...p,
        amount: Number(p.amount)
      })),
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ GET booking failed:", err);
    return NextResponse.json({ error: "โหลดรายละเอียดไม่สำเร็จ" }, { status: 500 });
  }
}

// ✅ PUT /api/bookings/[id]
export async function PUT(request, contextPromise) {
  const { params } = await contextPromise;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload ไม่เป็น JSON" }, { status: 400 });
  }

  const { status } = body;
  const allowed = ["pending", "confirmed", "cancelled", "completed"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 422 });
  }

  try {
    const updated = await prisma.booking.update({
      where: { booking_id: id },
      data: { status },
    });

    // เมื่อเปลี่ยนสถานะเป็น completed ให้จ่ายเงินให้ติวเตอร์ทันที (mock-up)
    if (status === "completed") {
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
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ PUT booking failed:", err);
    return NextResponse.json({ error: "อัปเดตไม่สำเร็จ" }, { status: 500 });
  }
}

// ✅ DELETE /api/bookings/[id]
export async function DELETE(_request, contextPromise) {
  const { params } = await contextPromise;
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    await prisma.booking.delete({ where: { booking_id: id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ DELETE booking failed:", err);
    return NextResponse.json({ error: "ลบการจองไม่สำเร็จ" }, { status: 500 });
  }
}
