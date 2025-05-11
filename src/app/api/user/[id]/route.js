// src/app/api/user/[id]/route.js

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const dynamic = "force-dynamic";

// GET and PUT handlers ยังคงเหมือนเดิม…
export async function GET(request, { params }) {
  const userId = Number(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        tutor: {
          include: {
            tutor_courses: { include: { subject: true } },
          },
        },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }
    // แปลงรูปผลลัพธ์ตามเดิม…
    const result = {
      ...user,
      courses: user.tutor?.tutor_courses.map((c) => ({
        course_id: c.course_id,
        title: c.course_title,
        rate: c.rate_per_hour,
        level: c.level,
        method: c.teaching_method,
        subject_name: c.subject.name,
      })) || [],
    };
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const userId = Number(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "ข้อมูล JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const { profile_image, name, phone, email, username, password, role } = body;
  const updateData = {};
  if (profile_image !== undefined) updateData.profile_image = profile_image;
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (email !== undefined) updateData.email = email;
  if (username !== undefined) updateData.username = username;
  if (password) updateData.password = password;
  if (role) updateData.role = role;

  try {
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: updateData,
    });
    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "อัปเดตไม่สำเร็จ" }, { status: 500 });
  }
}

// DELETE /api/user/[id]
export async function DELETE(request, { params }) {
  const userId = Number(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    // 1) ลบเรคคอร์ด Tutor (ถ้ามี)
    await prisma.tutor
      .delete({ where: { user_id: userId } })
      .catch(() => {}); // ถ้าไม่มี Tutor ก็ข้ามไป

    // 2) (ถ้าต้องการ) ลบเรคคอร์ดอื่นๆ ที่สัมพันธ์กับผู้ใช้ เช่น bookings, complaints ฯลฯ
    // await prisma.booking.deleteMany({ where: { student_id: userId } });
    // await prisma.complaint.deleteMany({ where: { reported_by: userId } });
    // …

    // 3) สุดท้าย ลบ User
    await prisma.user.delete({ where: { user_id: userId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ DELETE /api/user failed:", err);
    return NextResponse.json({ error: "ลบไม่สำเร็จ" }, { status: 500 });
  }
}
