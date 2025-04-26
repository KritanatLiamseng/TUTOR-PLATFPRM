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
      .then((data) => setTutors(Array.isArray(data) ? data : []));
  }, []);

  // ดึงคอร์สของแต่ละติวเตอร์
  useEffect(() => {
    tutors.forEach((tutor, idx) => {
      const id = tutor.tutor_id ?? tutor.user_id;
      if (!id) return;
      fetch(`/api/tutor/${id}/courses`)
        .then((res) => res.ok ? res.json() : [])
        .then((courses) => {
          setTutorCourses((prev) => ({ ...prev, [id]: courses }));
        });
    });
  }, [tutors]);

  const menuItems = [
    { label: "ประวัติการจอง", path: "/booking-history" },
    { label: "บัญชีของฉัน", path: "/account" },
    { label: "นโยบาย", path: "/policy" },
    { label: "ศูนย์ช่วยเหลือ", path: "/support" },
    { label: "รายงาน", path: "/report" },
    { label: "ออกจากระบบ", onClick: () => { localStorage.removeItem("userId"); router.push("/login"); } },
  ];

  const subjects = [
    "คณิตศาสตร์","วิทยาศาสตร์","ภาษาอังกฤษ","ภาษาไทย",
    "สังคมศึกษา","ประวัติศาสตร์","ดนตรี","ศิลปะ",
    "การเขียนโปรแกรม","เตรียมสอบเข้ามหาวิทยาลัย",
  ];

  return (
    <div className="min-h-screen bg-white font-sans relative">
      <Header dropdownItems={menuItems} user={user} />

      {/* Hero */}
      <section className="bg-blue-100 text-center py-12">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">เรียนกับติวเตอร์คุณภาพ</h1>
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

      {/* Subject Categories */}
      <section className="px-6 py-6 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-blue-800 mb-4">📘 หมวดหมู่วิชาหลัก</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject}
              className="bg-white border border-blue-200 text-blue-700 text-center p-4 rounded-lg hover:bg-blue-50 cursor-pointer"
            >{subject}</div>
          ))}
        </div>
      </section>

      {/* Tutor Carousel */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">ติวเตอร์แนะนำ</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-4">
            {tutors.map((tutor, idx) => {
              const id = tutor.tutor_id ?? tutor.user_id ?? idx;
              const displayName = tutor.name ?? tutor.username ?? "ติวเตอร์";
              const initial = displayName.charAt(0).toUpperCase();
              const courses = tutorCourses[id] ?? [];
              return (
                <div key={id} className="min-w-[280px] bg-white shadow-lg rounded-xl p-4 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold">
                      {initial}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{displayName}</h3>
                      <p className="text-sm text-gray-500">{tutor.subject_name ?? "ไม่ระบุวิชา"}</p>
                    </div>
                  </div>
                  <div className="mb-2 space-y-1">
                    {courses.slice(0,2).map(c => (
                      <p key={c.course_id} className="text-sm text-gray-600 truncate">• {c.course_title}</p>
                    ))}
                    {courses.length > 2 && (
                      <p
                        key="more"
                        className="text-xs text-blue-500 cursor-pointer"
                        onClick={() => router.push(`/tutor/courses/${id}`)}
                      >ดูทั้งหมด ({courses.length})</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" /> {(tutor.rating_average ?? 0).toFixed(1)}
                    </span>
                    <span className="font-semibold">{tutor.rate_per_hour ?? 500} ฿/ชม</span>
                  </div>
                  <button
                    onClick={() => router.push(`/tutor/courses/${id}`)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                  >ดูโปรไฟล์ติวเตอร์</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-400 text-white py-6 text-center">
        Tutor Platform © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
