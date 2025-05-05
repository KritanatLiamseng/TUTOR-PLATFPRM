"use client";

import { useEffect, useState } from "react";
import BackButton from "@/app/components/BackButton";
import { useRouter } from "next/navigation";

export default function TutorProfilePage({ params }) {
  const router = useRouter();
  const courseId = parseInt(params.course_id, 10);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // 1) ดึงข้อมูลคอร์สก่อน เพื่อรู้ว่า tutor คนไหน
    fetch(`/api/tutor/${params.id}`)  // params.id คือ user_id ของ tutor
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <p className="text-center py-10">กำลังโหลดข้อมูลติวเตอร์...</p>;
  }
  if (!profile) {
    return <p className="text-center text-red-500 mt-10">ไม่พบข้อมูลติวเตอร์</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <BackButton onClick={() => router.back()}>← ย้อนกลับ</BackButton>

        {/* ===== ส่วนโปรไฟล์ติวเตอร์ ===== */}
        <div className="mt-6 bg-white rounded-xl shadow p-8 flex justify-between items-start">
          <div className="flex items-center gap-6">
            <img
              src={profile.profile_image || "/default-profile.png"}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-2xl font-bold">
                {profile.name} {profile.surname}
              </h2>
              <p className="text-gray-600">ติวเตอร์</p>
              <p className="mt-2">
                <span className="font-semibold">📞</span> {profile.phone || "-"}
              </p>
              <p>
                <span className="font-semibold">✉️</span> {profile.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/tutor/profile/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            แก้ไขโปรไฟล์
          </button>
        </div>

        <div className="mt-4 bg-white rounded-xl shadow p-8 grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Username:</span> {profile.username}
          </div>
          <div>
            <span className="font-semibold">ระดับการศึกษา:</span>{" "}
            {profile.education_level || "-"}
          </div>
          <div>
            <span className="font-semibold">ประสบการณ์:</span>{" "}
            {profile.experience_years ?? 0} ปี
          </div>
          <div>
            <span className="font-semibold">เวลาว่าง:</span>{" "}
            {profile.available_time || "-"}
          </div>
        </div>

        {/* ===== ส่วน “คอร์สที่เปิดสอน” (ของคุณ) ===== */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">คอร์สที่เปิดสอน</h3>
          {/* … โค้ดแสดงคอร์ส … */}
        </div>
      </div>
    </div>
  );
}
