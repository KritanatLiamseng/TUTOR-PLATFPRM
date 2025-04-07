"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FooterNav from "@/app/components/FooterNav";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaUserEdit,
  FaArrowLeft,
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

  const profileData = [
    {
      label: "ชื่อ",
      value: profile.name,
      icon: <FaUser className="text-blue-500 mr-3" />,
    },
    {
      label: "เบอร์โทร",
      value: profile.phone,
      icon: <FaPhone className="text-green-500 mr-3" />,
    },
    {
      label: "อีเมล์",
      value: profile.email,
      icon: <FaEnvelope className="text-red-500 mr-3" />,
    },
    {
      label: "ชื่อผู้ใช้",
      value: profile.username,
      icon: <FaIdCard className="text-purple-500 mr-3" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-sky-100 via-white to-white">
      {/* Header */}
      <header className="relative w-full py-4 px-6 bg-white/90 shadow-md flex items-center justify-center">
        <button
          onClick={handleBackClick}
          className="absolute left-4 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          👤 โปรไฟล์ของฉัน
        </h1>
      </header>

      {/* Content */}
      <div className="w-full max-w-md px-6 py-8 flex flex-col items-center">
        {/* Avatar */}
        <div className="w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center shadow-md text-white text-3xl font-bold mb-6">
          {profile.name?.charAt(0).toUpperCase() || "?"}
        </div>

        {/* Info Card */}
        <div className="w-full space-y-4">
          {profileData.map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-white shadow-sm border border-gray-200 rounded-xl px-4 py-3 hover:shadow-md transition"
            >
              {item.icon}
              <div className="ml-2">
                <p className="text-gray-500 text-sm">{item.label}</p>
                <p className="text-gray-800 font-medium">{item.value || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleEditClick}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 shadow-md"
        >
          <FaUserEdit />
          แก้ไขข้อมูล
        </button>
      </div>

      <FooterNav active="โปรไฟล์" />
    </div>
  );
};

export default StudentProfilePage;
