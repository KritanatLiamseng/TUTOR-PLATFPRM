/* src/app/studentprofile/page.jsx */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { FaArrowLeft, FaPhone, FaEnvelope, FaUser, FaUniversity, FaUserEdit } from "react-icons/fa";

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { label: "ประวัติการจอง", path: "/booking-history" },
    { label: "บัญชีของฉัน", path: "/studentprofile" },
    { label: "นโยบาย", path: "/policy" },
    { label: "ศูนย์ช่วยเหลือ", path: "/support" },
    { label: "รายงาน", path: "/report" },
    {
      label: "ออกจากระบบ",
      onClick: () => {
        localStorage.removeItem("userId");
        router.push("/login");
      },
    },
  ];

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      setLoading(false);
      return;
    }

    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => setProfile({ error: true }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="กำลังโหลดโปรไฟล์..." />;
  if (!profile || profile.error) return <ErrorMessage msg="ไม่พบข้อมูลผู้ใช้" />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header dropdownItems={menuItems} />

      <div className="max-w-4xl mx-auto mt-8 px-4">
        {/* Back to home */}
        <button
          onClick={() => router.push("/")}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft /> ย้อนกลับ
        </button>

        <div className="bg-white rounded-2xl shadow p-6 relative">
          {/* Edit Button */}
          <button
            onClick={() => router.push("/studentprofile/edit")}
            className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FaUserEdit /> แก้ไขโปรไฟล์
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className="w-28 h-28 rounded-full bg-cover bg-center border-4 border-blue-200"
                style={{
                  backgroundImage: `url(${profile.profile_image || '/default-profile.png'})`,
                }}
              />
            </div>

            {/* Name & Role */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
              <p className="text-gray-500">นักศึกษา</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <InfoItem
                icon={<FaPhone />}
                label="เบอร์โทร"
                value={profile.phone || '-'}
              />
              <InfoItem
                icon={<FaEnvelope />}
                label="อีเมล"
                value={profile.email}
              />
            </div>
            <div className="space-y-4">
              <InfoItem
                icon={<FaUser />}
                label="ชื่อผู้ใช้"
                value={profile.username || '-'}
              />
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center bg-gray-50 p-4 rounded-lg">
      <span className="text-xl text-blue-600 mr-4">{icon}</span>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function Loader({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="animate-pulse text-gray-500">{message}</p>
    </div>
  );
}

function ErrorMessage({ msg }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{msg}</p>
    </div>
  );
}
