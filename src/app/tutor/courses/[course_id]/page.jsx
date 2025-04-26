import prisma from "@/prisma/client";
import BackButton from "@/app/components/BackButton";

export default async function CourseDetailPage({ params }) {
  // รอ await params ก่อนใช้งาน
  const { course_id: courseIdParam } = await params;
  const courseId = parseInt(courseIdParam, 10);

  if (isNaN(courseId)) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-red-500">
        ID คอร์สไม่ถูกต้อง
      </div>
    );
  }

  // ดึงข้อมูลคอร์ส พร้อมวิชาและข้อมูลติวเตอร์
  const course = await prisma.tutor_courses.findUnique({
    where: { course_id: courseId },
    include: {
      subject: true,
      tutor: { include: { user: true } },
    },
  });

  if (!course) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-red-500">
        ไม่พบคอร์สนี้
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      {/* ปุ่มย้อนกลับไปหน้าก่อนหน้า */}
      <BackButton>กลับ</BackButton>

      <h1 className="mt-4 text-3xl font-bold text-gray-800">
        {course.course_title}
      </h1>
      <p className="mt-2 text-gray-600">
        วิชา: {course.subject.name} &nbsp;|&nbsp; ระดับ: {course.level}
      </p>
      <p className="mt-4 text-gray-800">
        {course.course_description}
      </p>

      <div className="mt-6 flex flex-wrap gap-6 text-gray-700">
        <div>
          <span className="font-semibold">ราคา:</span> {course.rate_per_hour} บาท/ชม
        </div>
        <div>
          <span className="font-semibold">รูปแบบ:</span>{" "}
          {course.teaching_method === "online" ? "ออนไลน์" : "ออฟไลน์"}
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800">เกี่ยวกับติวเตอร์</h2>
        <div className="mt-4 flex items-center gap-4">
          <img
            src={course.tutor.user.profile_image || "/default-profile.png"}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{course.tutor.user.name}</p>
            <p className="text-sm text-gray-600">ติวเตอร์</p>
          </div>
        </div>
      </div>
    </div>
  );
}
