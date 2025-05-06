// File: src/app/tutor/[id]/page.jsx
import prisma from "@/prisma/client";
import BackButton from "@/app/components/BackButton";
import BookingButton from "@/app/components/BookingButton";
import Link from "next/link";

export default async function TutorDetailPage({ params }) {
  // 1) รอ params แล้ว destructure id
  const { id } = await params;
  const tutorId = parseInt(id, 10);
  if (isNaN(tutorId)) {
    return (
      <p className="text-center mt-10 text-red-500">
        ID ไม่ถูกต้อง
      </p>
    );
  }

  // 2) โหลดโปรไฟล์ติวเตอร์
  const tutor = await prisma.tutor.findUnique({
    where: { tutor_id: tutorId },
    include: { user: true },
  });

  // 3) ถ้าไม่เจอ → แสดง error
  if (!tutor) {
    return (
      <p className="text-center mt-10 text-red-500">
        ไม่พบบัญชีติวเตอร์
      </p>
    );
  }

  // 4) ดึงคอร์สของติวเตอร์
  const courses = await prisma.tutorCourse.findMany({
    where: { tutor_id: tutor.tutor_id },
    include: { subject: true },
    orderBy: { course_id: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-4xl mx-auto p-6">
        <BackButton>← ย้อนกลับ</BackButton>

        {/* โปรไฟล์ติวเตอร์ */}
        <div className="mt-6 bg-white rounded-xl shadow p-8">
          <div className="flex items-center space-x-6">
            <img
              src={tutor.user.profile_image || "/default-profile.png"}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h1 className="text-3xl font-bold">
                {tutor.user.name} {tutor.user.surname}
              </h1>
              <p className="text-gray-600">ติวเตอร์</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
            <div>
              <p>
                <strong>Username:</strong> {tutor.user.username}
              </p>
              <p>
                <strong>ประสบการณ์:</strong> {tutor.experience_years} ปี
              </p>
            </div>
            <div>
              <p>
                <strong>ระดับการศึกษา:</strong> {tutor.user.education_level || "-"}
              </p>
              <p>
                <strong>เวลาที่ว่าง:</strong> {tutor.available_time || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* คอร์สที่เปิดสอน */}
        <div className="mt-10 bg-white rounded-xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">คอร์สที่เปิดสอน</h2>
            <Link href={`/tutor/${tutorId}/courses/new`}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                + เพิ่มคอร์สใหม่
              </button>
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {courses.map((c) => (
                <div
                  key={c.course_id}
                  className="bg-gray-50 p-6 rounded-lg border flex flex-col"
                >
                  <h3 className="text-lg font-medium mb-1">
                    {c.course_title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    วิชา: {c.subject?.name || "-"} ({c.level || "-"})
                  </p>
                  <p className="text-gray-700 mb-2 line-clamp-2">
                    {c.course_description || "ไม่ระบุรายละเอียด"}
                  </p>
                  <div className="flex justify-between items-center text-gray-800 mb-3">
                    <span>ราคา: {c.rate_per_hour ?? "-"} ฿/ชม</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {c.teaching_method === "online" ? "ออนไลน์" : "ออฟไลน์"}
                    </span>
                  </div>

                  {/* ปุ่มจอง ชิดขวา และดูเป็นปุ่มจริง */}
                  <div className="mt-auto flex justify-end">
                    <BookingButton
                      courseId={c.course_id}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
                    >
                      จองคอร์ส
                    </BookingButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">ยังไม่มีคอร์สเปิดสอน</p>
          )}
        </div>
      </div>
    </div>
  );
}
