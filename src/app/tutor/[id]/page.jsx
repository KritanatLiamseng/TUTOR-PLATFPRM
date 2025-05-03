// src/app/tutor/[id]/page.jsx
import prisma from "@/prisma/client";
import BackButton from "@/app/components/BackButton";

export default async function TutorDetailPage({ params }) {
  const tutorId = parseInt(params.id, 10);
  if (isNaN(tutorId)) {
    return <p className="text-center mt-10 text-red-500">ID ไม่ถูกต้อง</p>;
  }

  const userWithTutor = await prisma.user.findUnique({
    where: { user_id: tutorId },
    include: { tutor: true },
  });

  if (!userWithTutor || !userWithTutor.tutor) {
    return <p className="text-center mt-10 text-red-500">ไม่พบบัญชีติวเตอร์</p>;
  }

  const t = userWithTutor.tutor;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <BackButton>← ย้อนกลับ</BackButton>
        <div className="mt-6 bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold mb-4">
            {userWithTutor.name} {userWithTutor.surname}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p><strong>อีเมล:</strong> {userWithTutor.email}</p>
              <p><strong>โทรศัพท์:</strong> {userWithTutor.phone || '-'}</p>
              <p><strong>Username:</strong> {userWithTutor.username}</p>
            </div>
            <div>
              <p><strong>ระดับการศึกษา:</strong> {userWithTutor.education_level || '-'}</p>
              <p><strong>ประสบการณ์:</strong> {t.experience_years} ปี</p>
              <p><strong>Bio:</strong> {t.bio || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
