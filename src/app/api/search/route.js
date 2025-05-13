import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q       = searchParams.get("q")?.trim() || "";
  const subjId  = searchParams.get("subject");
  const subject = subjId ? Number(subjId) : null;

  // ถ้าไม่กรองอะไรเลย → ให้ดึงติวเตอร์ทุกคน
  if (!q && !subject) {
    const allTutors = await prisma.tutor.findMany({
      include: {
        user: true,
        tutor_courses: {
          take: 3,
          include: { subject: true },
        },
      },
      take: 20, // หรือจะเอาทั้งหมดก็ลบ `take`
    });

    const fullResult = allTutors.map(t => ({
      tutorId: t.user_id,
      name:    t.user.name,
      avatar:  t.user.profile_image,
      rating_average: t.user.rating_average,  // ถ้ามี
      rate: t.tutor_courses[0]?.rate_per_hour ?? 0,
      courses: t.tutor_courses.map(c => ({
        courseId: c.course_id,
        title:    c.course_title,
        subject:  c.subject?.name,
        rate:     c.rate_per_hour,
      })),
    }));

    return NextResponse.json(fullResult);
  }

  // กรณีกรอง q หรือ subject
  const tutors = await prisma.tutor.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { user: { name: { contains: q, mode: "insensitive" } } },
                {
                  tutor_courses: {
                    some: {
                      OR: [
                        { course_title: { contains: q, mode: "insensitive" } },
                        { subject: { name: { contains: q, mode: "insensitive" } } },
                      ],
                    },
                  },
                },
              ],
            }
          : {},
        subject
          ? {
              tutor_courses: {
                some: { subject_id: subject },
              },
            }
          : {},
      ],
    },
    include: {
      user: true,
      tutor_courses: {
        take: 3,
        include: { subject: true },
      },
    },
    take: 20,
  });

  const result = tutors.map(t => ({
    tutorId: t.user_id,
    name:    t.user.name,
    avatar:  t.user.profile_image,
    rating_average: t.user.rating_average, // ถ้ามี
    rate: t.tutor_courses[0]?.rate_per_hour ?? 0,
    courses: t.tutor_courses.map(c => ({
      courseId: c.course_id,
      title:    c.course_title,
      subject:  c.subject?.name,
      rate:     c.rate_per_hour,
    })),
  }));

  return NextResponse.json(result);
}
