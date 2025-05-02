// File: src/app/tutor/courses/[course_id]/page.jsx
import prisma from "@/prisma/client";
import BackButton from "@/app/components/BackButton";

export default async function CourseDetailPage({ params }) {
  // ตรงนี้คือ Props ของ Next.js Page Component
  const courseId = parseInt(params.course_id, 10);
  if (isNaN(courseId)) {
    return (
      <p className="text-center text-red-500 mt-10">
        ID คอร์สไม่ถูกต้อง
      </p>
    );
  }

  // ดึงข้อมูลคอร์สจาก DB
  const course = await prisma.tutorCourse.findUnique({
    where: { course_id: courseId },
    include: {
      subject: true,
      tutor: {
        include: { user: true }
      }
    },
  });

  if (!course) {
    return (
      <p className="text-center text-red-500 mt-10">
        ไม่พบคอร์สนี้
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* ปุ่มกลับ */}
        <BackButton>← ย้อนกลับ</BackButton>

        <div className="mt-6 bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold mb-4">{course.course_title}</h1>
          <p className="text-gray-600 mb-2">
            วิชา: {course.subject.name} | ระดับ: {course.level || "-"}
          </p>
          <p className="mb-6 text-gray-800">{course.course_description}</p>

          <div className="flex flex-wrap gap-8 text-gray-700 mb-8">
            <div>
              <span className="font-semibold">ราคา:</span>{" "}
              {course.rate_per_hour ?? "-"} ฿/ชม.
            </div>
            <div>
              <span className="font-semibold">รูปแบบ:</span>{" "}
              {course.teaching_method === "online"
                ? "ออนไลน์"
                : course.teaching_method === "offline"
                  ? "ออฟไลน์"
                  : "-"}
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">เกี่ยวกับติวเตอร์</h2>
            <div className="flex items-center gap-4">
              <img
                src={course.tutor.user.profile_image || "/default-profile.png"}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <p className="text-lg font-medium">
                  {course.tutor.user.name} {course.tutor.user.surname}
                </p>
                <p className="text-gray-500">ติวเตอร์</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
