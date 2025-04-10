"use client";

import FooterBar from "@/app/components/Footerbar";
import { useEffect, useState } from "react";

const HomeTutorPage = () => {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`/api/tutor/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setTutor(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("โหลดข้อมูลผิดพลาด:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        กำลังโหลดข้อมูล...
      </p>
    );
  }

  if (!tutor) {
    return (
      <p className="text-center mt-10 text-red-500">
        ไม่พบข้อมูลติวเตอร์ หรือคุณยังไม่ได้เข้าสู่ระบบ
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <div className="w-full max-w-4xl p-4">
        {/* ส่วนข้อมูลติวเตอร์ */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-24 h-24 bg-blue-300 rounded-full overflow-hidden flex items-center justify-center mr-4">
              <img
                src={tutor.profile_image || "/default-profile.png"}
                alt="รูปติวเตอร์"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{tutor.name}</h2>
              <p className="text-gray-600">ติวเตอร์</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>วุฒิการศึกษา:</strong> {tutor.education_level || "-"}</div>
            <div><strong>ประสบการณ์:</strong> {tutor.experience_years || 0} ปี</div>
            <div><strong>ความพร้อมของตารางเวลา:</strong> {tutor.available_time || "-"}</div>
            <div><strong>อัตราค่าบริการ:</strong> {tutor.rate_per_hour || 0} บาท/ชั่วโมง</div>
          </div>
        </div>

        {/* ส่วนคอร์สที่เปิดสอน */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">คอร์สที่เปิดสอน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* รอข้อมูลจริงจาก backend เช่น /api/tutor/{id}/courses */}
            <p className="text-gray-500">(ยังไม่มีข้อมูลคอร์ส)</p>
          </div>
        </div>
      </div>

      <FooterBar />
    </div>
  );
};

export default HomeTutorPage;
