"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import FooterBar from "@/app/components/Footerbar";

const TutorProfilePage = () => {
  const router = useRouter();
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

  const handleEditClick = () => {
    router.push("/tutorprofile/edittutor");
  };

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 text-lg animate-pulse">
        กำลังโหลดข้อมูล...
      </p>
    );
  }

  if (!tutor) {
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        ไม่พบข้อมูลติวเตอร์ หรือคุณยังไม่ได้เข้าสู่ระบบ
      </p>
    );
  }

  const infoItems = [
    { label: "ชื่อ", value: tutor.name },
    { label: "เบอร์โทร", value: tutor.phone },
    { label: "อีเมล์", value: tutor.email },
    { label: "ชื่อผู้ใช้", value: tutor.username },
    { label: "ประวัติการศึกษา", value: tutor.education_level || "ไม่ระบุ" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      {/* Header */}
      <div className="relative text-center py-6 bg-white/70 shadow-md sticky top-0 z-10">
        <button
          onClick={handleBackClick}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-700">👨‍🏫 โปรไฟล์ติวเตอร์</h1>
      </div>

      {/* Content */}
      <div className="w-full max-w-2xl mx-auto px-6 py-6">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-blue-400 rounded-full overflow-hidden shadow-lg flex items-center justify-center">
            <img
              src={tutor.profile_image || "/default-profile.png"}
              alt="โปรไฟล์"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md rounded-xl shadow-sm px-6 py-4"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-lg font-semibold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Documents */}
        <h2 className="text-xl font-semibold text-gray-700 mt-10 mb-4">📄 เอกสารที่เกี่ยวข้อง</h2>
        <div className="space-y-4">
          {tutor.document_id_card && (
            <div className="bg-white rounded-xl shadow p-4">
              <p className="font-semibold mb-2">บัตรประชาชน</p>
              <img
                src={tutor.document_id_card}
                alt="บัตรประชาชน"
                className="rounded-md w-full"
              />
            </div>
          )}
          {tutor.document_profile && (
            <div className="bg-white rounded-xl shadow p-4">
              <p className="font-semibold mb-2">รูปถ่ายใบหน้า</p>
              <img
                src={tutor.document_profile}
                alt="ใบหน้า"
                className="rounded-md w-full"
              />
            </div>
          )}
          {tutor.document_certificate && (
            <div className="bg-white rounded-xl shadow p-4">
              <p className="font-semibold mb-2">เอกสารรับรองอื่น ๆ</p>
              <a
                href={tutor.document_certificate}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                ดูเอกสารรับรอง (PDF)
              </a>
            </div>
          )}
        </div>

        {/* Edit Button */}
        <button
          onClick={handleEditClick}
          className="mt-8 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-full shadow-lg transition"
        >
          ✏️ แก้ไขโปรไฟล์
        </button>
      </div>

      <FooterBar active="โปรไฟล์" />
    </div>
  );
};

export default TutorProfilePage;
