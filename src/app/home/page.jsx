"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/header";
import { FaSearch, FaStar, FaBook } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // โหลด user
  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (uid) {
      fetch(`/api/user/${uid}`)
        .then((r) => r.json())
        .then(setUser)
        .catch(console.error);
    }
  }, []);

  // โหลดติวเตอร์
  useEffect(() => {
    fetch("/api/tutors")
      .then((r) => r.json())
      .then((data) => setTutors(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // โหลดหมวดหมู่วิชา
  useEffect(() => {
    fetch("/api/subjects")
      .then((r) => r.json())
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header dropdownItems={menuItems} user={user} />

      {/* Hero */}
      <section className="bg-blue-100 text-center py-12">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          เรียนกับติวเตอร์คุณภาพ
        </h1>
        <p className="text-gray-700 text-lg">ค้นหา จอง และเรียนรู้ในที่เดียว</p>
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อติวเตอร์หรือวิชา..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </section>

      {/* หมวดหมู่วิชาหลัก */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center mb-4">
          <FaBook className="text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-blue-800">หมวดหมู่วิชาหลัก</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {subjects.map((subj) => (
            <button
              key={subj.subject_id}
              onClick={() => router.push(`/home?subject=${subj.subject_id}`)}
              className="py-2 px-4 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition"
            >
              {subj.name}
            </button>
          ))}
        </div>
      </section>

      {/* ติวเตอร์แนะนำ */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">ติวเตอร์แนะนำ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}  // ← ใช้ id ที่มาจาก API (unique)
              className="bg-white rounded-xl shadow p-6 flex flex-col"
            >
              {/* Avatar + Name */}
              <div className="flex items-center mb-4">
                <img
                  src={tutor.profile_image || "/default-profile.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-semibold">{tutor.name}</p>
                  <p className="text-sm text-gray-500">{tutor.bio}</p>
                </div>
              </div>

              {/* Rating & Rate */}
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center text-yellow-500">
                  <FaStar />{" "}
                  <span className="ml-1">
                    {tutor.rating_average.toFixed(1)}
                  </span>
                </span>
                <span className="font-medium">
                  {tutor.rate_per_hour} ฿/ชม
                </span>
              </div>

              {/* ปุ่ม */}
              <div className="mt-auto space-y-2">
                <button
                  onClick={() => router.push(`/tutor/${tutor.id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  ดูโปรไฟล์ติวเตอร์
                </button>
                <button
                  onClick={() => router.push(`/tutor/${tutor.id}`)}
                  className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50"
                >
                  จองทันที
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-400 text-white text-center py-6">
        Tutor Platform © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
