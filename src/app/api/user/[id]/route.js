// src/app/api/user/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const dynamic = "force-dynamic";

// GET /api/user/:id
export async function GET(request, { params }) {
  const userId = Number(params.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        tutor: {
          include: {
            tutor_courses: {
              include: { subject: true }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }

    // จัดโครงสร้างเฉพาะที่ต้องการ
    return NextResponse.json({
      user_id:             user.user_id,
      name:                user.name,
      surname:             user.surname,
      profile_image:       user.profile_image,
      email:               user.email,
      phone:               user.phone,
      education_level:     user.education_level,
      status:              user.status,
      role:                user.role,
      // ดึงจาก tutor (include มาแล้ว)
      bank_name:           user.tutor?.bank_name           ?? null,
      bank_account_number: user.tutor?.bank_account_number ?? null,
      bank_account_name:   user.tutor?.bank_account_name   ?? null,
      courses: (user.tutor?.tutor_courses || []).map((c) => ({
        course_id:    c.course_id,
        title:        c.course_title,
        rate:         c.rate_per_hour,
        level:        c.level,
        method:       c.teaching_method,
        subject_name: c.subject.name,
      }))
    });
  } catch (err) {
    console.error("GET /api/user/[id] error:", err);
    return NextResponse.json({ error: "โหลดไม่สำเร็จ" }, { status: 500 });
  }
}

// PUT and DELETE handlers เดิมไม่มีการกระทบ
