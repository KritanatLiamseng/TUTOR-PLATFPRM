"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaUserEdit,
} from "react-icons/fa";

const StudentProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
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
    router.push("/studentprofile/edit");
  };

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        กำลังโหลดข้อมูล...
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="text-center mt-10 text-red-500">
        ไม่พบข้อมูลผู้ใช้ หรือคุณยังไม่ได้เข้าสู่ระบบ
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white font-sans">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow">
        <button
          onClick={handleBackClick}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          👤 โปรไฟล์ของฉัน
        </h1>
        <div></div> {/* Placeholder to center the title */}
      </header>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-6 md:flex md:gap-8 items-center">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow">
            <div className="w-full h-full bg-blue-400 flex items-center justify-center text-white text-4xl font-bold">
              {profile.name?.charAt(0).toUpperCase() || "?"}
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mt-4">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>

        {/* Info Section */}
        <div className="flex-1 mt-6 md:mt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow flex items-center">
              <FaPhone className="text-green-500 mr-3" />
              <div>
                <p className="text-gray-600 text-sm">เบอร์โทร</p>
                <p className="font-medium text-gray-800">{profile.phone}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow flex items-center">
              <FaIdCard className="text-purple-500 mr-3" />
              <div>
                <p className="text-gray-600 text-sm">ชื่อผู้ใช้</p>
                <p className="font-medium text-gray-800">{profile.username}</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={handleEditClick}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
            >
              <FaUserEdit className="inline-block mr-2" /> แก้ไขข้อมูล
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;