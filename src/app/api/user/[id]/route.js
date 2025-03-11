import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params;
    console.log(`API เรียกข้อมูลผู้ใช้ด้วย ID: ${id}`);
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: parseInt(id) },
        });

        if (!user) {
            console.log("ไม่พบข้อมูลผู้ใช้ในฐานข้อมูล");
            return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });
        }

        console.log("ข้อมูลผู้ใช้จากฐานข้อมูล:", user);
        return NextResponse.json(user);
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" }, { status: 500 });
    }
}
