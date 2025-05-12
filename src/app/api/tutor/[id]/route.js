// src/app/api/tutor/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";


async function parseRequest(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await request.json();
  }
  const form = await request.formData();
  const out = {};
  for (const [key, val] of form.entries()) {
    out[key] = val;
  }
  return out;
}

// PUT /api/tutor/:id
export async function PUT(request, { params }) {
  const userId = Number(params.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  let body;
  try {
    body = await parseRequest(request);
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const userData = {
    name:     body.name,
    phone:    body.phone,
    email:    body.email,
    username: body.username,
  };
  const tutorData = {
    bio:                   body.bio,
    experience_years:      body.experience_years ? Number(body.experience_years) : undefined,
    rate_per_hour:         body.rate_per_hour    ? Number(body.rate_per_hour)    : undefined,
    available_time:        body.available_time,
    education_background:  body.education_level,
    bank_name:             body.bank_name,
    bank_account_number:   body.bank_account_number,
    bank_account_name:     body.bank_account_name,
  };

  // ถ้ามีไฟล์ อัปโหลด แปลงเป็น data URL
  if (body.profile_image && body.profile_image instanceof File) {
    const buf = Buffer.from(await body.profile_image.arrayBuffer());
    userData.profile_image = `data:${body.profile_image.type};base64,${buf.toString("base64")}`;
  }
  if (body.verification_documents && body.verification_documents instanceof File) {
    const buf = Buffer.from(await body.verification_documents.arrayBuffer());
    tutorData.verification_documents = `data:${body.verification_documents.type};base64,${buf.toString("base64")}`;
  }

  try {
    // อัปเดต tutor ก่อน (cascade ไป user)
    await prisma.tutor.update({
      where: { user_id: userId },
      data:  tutorData,
    });
    await prisma.user.update({
      where: { user_id: userId },
      data:  userData,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PUT /api/tutor/[id] error:", e);
    return NextResponse.json({ error: "อัปเดตไม่สำเร็จ" }, { status: 500 });
  }
}

// GET /api/tutor/:id
export async function GET(_request, { params }) {
  const userId = Number(params.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }
  try {
    const userWithTutor = await prisma.user.findUnique({
      where:   { user_id: userId },
      include: { tutor: true },
    });
    if (!userWithTutor?.tutor) {
      return NextResponse.json({ error: "ไม่พบติวเตอร์" }, { status: 404 });
    }
    // รวมข้อมูล user + tutor เป็น payload เดียว
    return NextResponse.json({
      ...userWithTutor,
      ...userWithTutor.tutor,
    });
  } catch (e) {
    console.error("GET /api/tutor/[id] error:", e);
    return NextResponse.json({ error: "โหลดไม่สำเร็จ" }, { status: 500 });
  }
}
