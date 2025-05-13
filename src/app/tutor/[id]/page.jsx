// src/app/tutor/[id]/page.jsx
import prisma from "@/prisma/client";
import BackButton from "@/app/components/BackButton";
import BookingButton from "@/app/components/BookingButton";

export default async function TutorDetailPage({ params }) {
  const tutorUserId = parseInt(params.id, 10);
  if (isNaN(tutorUserId)) {
    return <p className="text-center mt-10 text-red-500">ID ไม่ถูกต้อง</p>;
  }

  // 1) โหลดข้อมูล user + tutor + tutor_courses
  const userWithTutor = await prisma.user.findUnique({
    where: { user_id: tutorUserId },
    include: {
      tutor: {
        include: {
          tutor_courses: {
            include: { subject: true }
          }
        }
      }
    }
  });

  // 2) ถ้าไม่เจอ หรือ ไม่ใช่ติวเตอร์
  if (!userWithTutor?.tutor) {
    return <p className="text-center mt-10 text-red-500">ไม่พบบัญชีติวเตอร์</p>;
  }

  const { tutor, name, surname, profile_image } = userWithTutor;
  const courses = tutor.tutor_courses;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-4xl mx-auto p-6">
        <BackButton> ย้อนกลับ</BackButton>

        {/* โปรไฟล์ติวเตอร์ */}
        <div className="mt-6 bg-white rounded-xl shadow p-8">
          <div className="flex items-center space-x-6">
            <img
              src={profile_image || "/default-profile.png"}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h1 className="text-3xl font-bold">
                {name} {surname}
              </h1>
              <p className="text-gray-600">ติวเตอร์</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
            <div>
              <p>
                <strong>Username:</strong> {userWithTutor.username}
              </p>
              <p>
                <strong>ประสบการณ์:</strong> {tutor.experience_years} ปี
              </p>
            </div>
            <div>
              <p>
                <strong>ระดับการศึกษา:</strong> {userWithTutor.education_level || "-"}
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
          </div>

          {courses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {courses.map(c => (
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
                  <div className="mt-auto flex justify-end">
                    <BookingButton courseId={c.course_id} />
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
