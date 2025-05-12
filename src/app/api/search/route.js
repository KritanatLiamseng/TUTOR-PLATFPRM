// src/app/api/search/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q       = searchParams.get("q")?.trim() || "";
  const subjId  = searchParams.get("subject");
  const subject = subjId ? Number(subjId) : null;

  if (!q && !subject) {
    // no filter → return all tutors (or maybe your existing /api/tutors)
    return NextResponse.json([], { status: 200 });
  }

  const tutors = await prisma.tutor.findMany({
    where: {
      AND: [
        // if q provided, filter by name / title / subject.name
        q
          ? {
              OR: [
                { user: { name: { contains: q, mode: "insensitive" } } },
                {
                  tutor_courses: {
                    some: {
                      OR: [
                        { course_title: { contains: q, mode: "insensitive" } },
                        { subject:      { name:   { contains: q, mode: "insensitive" } } },
                      ],
                    },
                  },
                },
              ],
            }
          : {},
        // if subject provided, filter by subject_id
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

  const result = tutors.map((t) => ({
    tutorId: t.user_id,
    name:    t.user.name,
    avatar:  t.user.profile_image,
    courses: t.tutor_courses.map((c) => ({
      courseId:   c.course_id,
      title:      c.course_title,
      subject:    c.subject?.name,
      rate:       c.rate_per_hour,
    })),
  }));

  return NextResponse.json(result);
}
