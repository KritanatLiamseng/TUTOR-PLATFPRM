// src/app/api/tutor/[id]/bank/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT(request, { params }) {
  const userId = Number(params.id);
  if (!userId) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json(); 
  } catch {
    return NextResponse.json({ error: "JSON ไม่ถูกต้อง" }, { status: 400 });
  }

  const { bank_name, bank_account_number, bank_account_name } = body;

  try {
    await prisma.tutor.update({
      where: { user_id: userId },
      data: {
        bank_name,
        bank_account_number,
        bank_account_name,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "บันทึกข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}
