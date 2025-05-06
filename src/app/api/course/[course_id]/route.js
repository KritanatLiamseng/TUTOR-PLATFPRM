// File: src/app/api/course/[course_id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request, context) {
  // 1) unwrap params promise
  const params = await context.params;
  const courseId = parseInt(params.course_id, 10);
  if (isNaN(courseId)) {
    return NextResponse.json(
      { error: "ID คอร์สไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  // 2) fetch course + subject + tutor.user
  const course = await prisma.tutorCourse.findUnique({
    where: { course_id: courseId },
    include: {
      subject: true,
      tutor: {
        include: {
          user: {
            select: { name: true, surname: true, profile_image: true },
          },
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json(
      { error: "ไม่พบคอร์สนี้" },
      { status: 404 }
    );
  }

  // 3) return JSON
  return NextResponse.json(
    {
      course_id:          course.course_id,
      subject_id:         course.subject_id,
      subject_name:       course.subject.name,
      course_title:       course.course_title,
      course_description: course.course_description,
      rate_per_hour:      course.rate_per_hour,
      teaching_method:    course.teaching_method,
      level:              course.level,
      tutor: {
        tutor_id:      course.tutor.tutor_id,
        name:          course.tutor.user.name,
        surname:       course.tutor.user.surname,
        profile_image: course.tutor.user.profile_image,
      },
    },
    { status: 200 }
  );
}

export async function PUT(request, context) {
  // 1) unwrap params promise
  const params = await context.params;
  const courseId = parseInt(params.course_id, 10);
  if (isNaN(courseId)) {
    return NextResponse.json(
      { error: "ID คอร์สไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  // 2) parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON payload ไม่ถูกต้อง" },
      { status: 400 }
    );
  }
  const {
    subject_id,
    course_title,
    course_description = "",
    rate_per_hour,
    teaching_method = "",
    level = "",
  } = body;

  if (!subject_id || !course_title || rate_per_hour == null) {
    return NextResponse.json(
      { error: "ข้อมูลคอร์สไม่ครบถ้วน" },
      { status: 422 }
    );
  }

  // 3) update
  try {
    const updated = await prisma.tutorCourse.update({
      where: { course_id: courseId },
      data: {
        subject_id:         Number(subject_id),
        course_title,
        course_description,
        rate_per_hour:      Number(rate_per_hour),
        teaching_method,
        level,
      },
    });

    return NextResponse.json(
      {
        course_id:          updated.course_id,
        subject_id:         updated.subject_id,
        course_title:       updated.course_title,
        course_description: updated.course_description,
        rate_per_hour:      updated.rate_per_hour,
        teaching_method:    updated.teaching_method,
        level:              updated.level,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ อัปเดตคอร์สล้มเหลว:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตคอร์ส" },
      { status: 500 }
    );
  }
}
