// File: src/app/api/search/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  if (!q) {
    return NextResponse.json([], { status: 200 });
  }

  // ค้นหาตามชื่อผู้ใช้ หรือชื่อคอร์ส (subject, title)
  const tutors = await prisma.tutor.findMany({
    where: {
      OR: [
        { user: { name: { contains: q, mode: "insensitive" } } },
        {
          tutorCourse: {
            some: {
              OR: [
                { course_title:      { contains: q, mode: "insensitive" } },
                { subject: { name:   { contains: q, mode: "insensitive" } } },
              ],
            },
          },
        },
      ],
    },
    include: {
      user: true,
      tutorCourse: {
        take: 3,
        include: { subject: true },
      },
    },
    take: 20,
  });

  // ตัดข้อมูลส่งกลับเฉพาะที่จำเป็น
  const result = tutors.map((t) => ({
    tutorId: t.user_id,
    name:    t.user.name,
    avatar:  t.user.profile_image,
    courses: t.tutorCourse.map((c) => ({
      courseId:   c.course_id,
      title:      c.course_title,
      subject:    c.subject?.name,
      rate:       c.rate_per_hour,
    })),
  }));

  return NextResponse.json(result, { status: 200 });
}
