// src/app/api/user/[id]/route.js

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";

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
        // ดึง tutor และใน tutor ให้ดึง tutor_courses พร้อม subject
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

    // Map tutor_courses -> courses
    const courses = (user.tutor?.tutor_courses || []).map(c => ({
      course_id:    c.course_id,
      title:        c.course_title,
      rate:         c.rate_per_hour,
      level:        c.level,
      method:       c.teaching_method,
      subject_name: c.subject.name,
    }));

    return NextResponse.json({
      user_id:             user.user_id,
      name:                user.name,
      surname:             user.surname,
      profile_image:       user.profile_image,
      email:               user.email,
      phone:               user.phone,
      username:            user.username,
      role:                user.role,
      education_level:     user.education_level,
      status:              user.status,
      bank_name:           user.tutor?.bank_name           ?? null,
      bank_account_number: user.tutor?.bank_account_number ?? null,
      bank_account_name:   user.tutor?.bank_account_name   ?? null,
      courses,  // <— ตรงนี้
    });
  } catch (err) {
    console.error("GET /api/user/[id] error:", err);
    return NextResponse.json({ error: "โหลดไม่สำเร็จ" }, { status: 500 });
  }
}

// PUT /api/user/:id
export async function PUT(request, { params }) {
  const userId = Number(params.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const {
    name,
    surname,
    email,
    phone,
    role,
    bank_name,
    bank_account_number,
    bank_account_name,
    profile_image,
    username,
    password,
  } = body;

  const userData = {};
  if (name          !== undefined) userData.name           = name;
  if (surname       !== undefined) userData.surname        = surname;
  if (email         !== undefined) userData.email          = email;
  if (phone         !== undefined) userData.phone          = phone;
  if (role          !== undefined) userData.role           = role;
  if (profile_image !== undefined) userData.profile_image  = profile_image;
  if (username      !== undefined) userData.username       = username;
  if (password) {
    userData.password = await bcrypt.hash(password, 10);
  }

  try {
    await prisma.user.update({
      where: { user_id: userId },
      data:  userData,
    });

    if (role === "tutor") {
      await prisma.tutor.upsert({
        where: { user_id: userId },
        create: {
          user_id,
          bank_name,
          bank_account_number,
          bank_account_name,
        },
        update: {
          bank_name,
          bank_account_number,
          bank_account_name,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/user/[id] error:", err);
    return NextResponse.json({ error: "อัปเดตไม่สำเร็จ" }, { status: 500 });
  }
}

// DELETE /api/user/:id
export async function DELETE(request, { params }) {
  const userId = Number(params.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    await prisma.tutor.delete({ where: { user_id: userId } }).catch(() => {});
    await prisma.user.delete({ where: { user_id: userId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/user/[id] error:", err);
    return NextResponse.json({ error: "ลบไม่สำเร็จ" }, { status: 500 });
  }
}
