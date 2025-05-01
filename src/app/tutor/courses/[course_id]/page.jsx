import prisma from "@/prisma/client";
import BackButton from "@/app/components/BackButton";

export default async function CourseDetailPage({ params }) {
  const courseId = parseInt(params.course_id, 10);
  if (isNaN(courseId)) {
    return <p className="text-center text-red-500 mt-10">ID ไม่ถูกต้อง</p>;
  }

  const course = await prisma.tutor_courses.findUnique({
    where: { course_id: courseId },
    include: {
      subject: true,
      tutor: { include: { user: true } },
    },
  });

  if (!course) {
    return <p className="text-center text-red-500 mt-10">ไม่พบคอร์สนี้</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <BackButton>ย้อนกลับ</BackButton>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">{course.course_title}</h1>
        <p className="text-gray-600 mt-2">
          วิชา: {course.subject.name} | ระดับ: {course.level}
        </p>

        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <p className="text-gray-700">{course.course_description}</p>
          <div className="mt-4 space-y-2 text-gray-600">
            <p>ราคา: {course.rate_per_hour} บาท/ชม.</p>
            <p>รูปแบบ: {course.teaching_method === "online" ? "ออนไลน์" : "ออฟไลน์"}</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลติวเตอร์</h2>
          <div className="flex items-center gap-4">
            <img
              src={course.tutor.user.profile_image || "/default-profile.png"}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-800">{course.tutor.user.name}</p>
              <p className="text-gray-600">ติวเตอร์</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
