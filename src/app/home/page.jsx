"use client";

import { useEffect, useState } from "react";
import Header from "../components/header";
import { FaSearch, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [tutors, setTutors] = useState([]);
  const [tutorCourses, setTutorCourses] = useState({});
  const [user, setUser] = useState(null);

  // โหลดข้อมูลผู้ใช้
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((data) => setUser(data));
    }
  }, []);

  // โหลดรายชื่อติวเตอร์
  useEffect(() => {
    fetch("/api/tutors")
      .then((res) => res.json())
      .then((data) => {
        setTutors(Array.isArray(data) ? data : []);
      });
  }, []);

  // ดึงคอร์สของแต่ละติวเตอร์
  useEffect(() => {
    tutors.forEach((tutor) => {
      const tutorUserId = tutor.user_id;
      if (!tutorUserId) return;

      fetch(`/api/tutor/${tutorUserId}/courses`)
        .then((res) => (res.ok ? res.json() : []))
        .then((courses) => {
          setTutorCourses((prev) => ({ ...prev, [tutorUserId]: courses }));
        });
    });
  }, [tutors]);

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

  const subjects = [
    "คณิตศาสตร์", "วิทยาศาสตร์", "ภาษาอังกฤษ", "ภาษาไทย",
    "สังคมศึกษา", "ประวัติศาสตร์", "ดนตรี", "ศิลปะ",
    "การเขียนโปรแกรม", "เตรียมสอบเข้ามหาวิทยาลัย",
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header dropdownItems={menuItems} user={user} />

      {/* Hero */}
      <section className="bg-blue-100 text-center py-12">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          เรียนกับติวเตอร์คุณภาพ
        </h1>
        <p className="text-gray-700 text-lg">
          ค้นหา จอง และเรียนรู้ในที่เดียว
        </p>
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

      {/* Subject Categories */}
      <section className="px-6 py-6 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-blue-800 mb-4">
          📘 หมวดหมู่วิชาหลัก
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((subj) => (
            <div
              key={subj}
              className="bg-white border border-blue-200 text-blue-700 text-center p-4 rounded-lg hover:bg-blue-50 cursor-pointer"
            >
              {subj}
            </div>
          ))}
        </div>
      </section>

      {/* Tutor Recommended Grid */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">ติวเตอร์แนะนำ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tutors.map((tutor) => {
            const { user_id, name, subject, rating_average, rate_per_hour } = tutor;
            const courses = tutorCourses[user_id] || [];

            return (
              <div
                key={user_id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col"
              >
                {/* Avatar + Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-semibold text-blue-600">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-500">{subject}</p>
                  </div>
                </div>

                {/* Rating & Price */}
                <div className="flex items-center justify-between mb-4 text-gray-700">
                  <span className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm">{rating_average.toFixed(1)}</span>
                  </span>
                  <span className="text-sm font-medium">{rate_per_hour} ฿/ชม</span>
                </div>

                {/* Quick Course List */}
                <div className="flex-1 mb-4 text-gray-600 text-sm space-y-1">
                  {courses.slice(0, 3).map((c) => (
                    <p key={c.course_id} className="truncate">
                      • {c.course_title}
                    </p>
                  ))}
                  {courses.length > 3 && (
                    <p
                      key={`more-${user_id}`}
                      className="text-xs text-blue-600 cursor-pointer hover:underline"
                      onClick={() => router.push(`/tutor/courses/${user_id}`)}
                    >
                      ดูทั้งหมด ({courses.length})
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-2">
                  <button
                    onClick={() => router.push(`/tutor/courses/${user_id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition"
                  >
                    ดูโปรไฟล์ติวเตอร์
                  </button>
                  <button
                    onClick={() => router.push(`/tutor/courses/${user_id}`)}
                    className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-50 transition"
                  >
                    จองทันที
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-400 text-white py-6 text-center">
        Tutor Platform © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
