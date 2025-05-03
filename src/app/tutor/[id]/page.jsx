// File: src/app/tutor/[id]/page.jsx
import prisma from "@/prisma/client";
import BackButton from "@/app/components/BackButton";

export default async function TutorDetailPage({ params }) {
  const tutorId = parseInt(params.id, 10);
  if (isNaN(tutorId)) {
    return <p className="text-center mt-10 text-red-500">ID ไม่ถูกต้อง</p>;
  }

  // ---- แก้จุดนี้ ----
  const tutor = await prisma.tutor.findUnique({
    where: { tutor_id: tutorId },
    include: {
      user: true,           // ดึงข้อมูล user มาใช้งาน
    },
  });

  if (!tutor) {
    return (
      <p className="text-center mt-10 text-red-500">
        ไม่พบบัญชีติวเตอร์
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <BackButton>← ย้อนกลับ</BackButton>
        <div className="mt-6 bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold mb-4">
            {tutor.user.name} {tutor.user.surname}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p><strong>อีเมล:</strong> {tutor.user.email}</p>
              <p><strong>โทรศัพท์:</strong> {tutor.user.phone || "-"}</p>
              <p><strong>Username:</strong> {tutor.user.username}</p>
            </div>
            <div>
              <p><strong>ระดับการศึกษา:</strong> {tutor.user.education_level || "-"}</p>
              <p><strong>ประสบการณ์:</strong> {tutor.experience_years} ปี</p>
              <p><strong>Bio:</strong> {tutor.bio || "-"}</p>
              <p><strong>ราคา:</strong> {tutor.rate_per_hour ?? "-"} ฿/ชม.</p>
              <p><strong>เวลาที่ว่าง:</strong> {tutor.available_time || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
