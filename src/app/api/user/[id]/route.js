/* src/app/api/user/[id]/route.js */

import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

// GET /api/user/[id]
export async function GET(request, context) {
  const params = await context.params;
  const userId = parseInt(params.id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }
  try {
    const user = await prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// PUT /api/user/[id]
export async function PUT(request, context) {
  const params = await context.params;
  const userId = parseInt(params.id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "ข้อมูล JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const {
    profile_image,
    name,
    phone,
    email,
    username,
    password,
  } = body;

  try {
    const updateData = {};
    if (profile_image !== undefined) updateData.profile_image = profile_image;
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (password) updateData.password = password; // hash ก่อนใช้จริง

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
