"use client";
import { useEffect, useState } from "react";
import Header from "../components/header";
import { FaUserGraduate, FaStar, FaSearch, FaUser, FaHistory, FaFileAlt, FaQuestionCircle, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";

export default function HomePage() {
  const [tutors, setTutors] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((data) => setUser(data));
    }
  }, []);

  useEffect(() => {
    fetch("/api/tutors")
      .then((res) => res.json())
      .then((data) => setTutors(data));
  }, []);

  const subjects = [
    "คณิตศาสตร์",
    "วิทยาศาสตร์",
    "ภาษาอังกฤษ",
    "ภาษาไทย",
    "สังคมศึกษา",
    "ประวัติศาสตร์",
    "ดนตรี",
    "ศิลปะ",
    "การเขียนโปรแกรม",
    "เตรียมสอบเข้ามหาวิทยาลัย"
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans relative">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">🎓 Tutor Platform</h1>
        <div className="relative">
          {user ? (
            <div>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-sm text-gray-700 hover:text-blue-600 font-medium"
              >
                👋 สวัสดี, <b>{user.name}</b>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50 text-sm">
                  <a href="/studentprofile" className="block px-4 py-2 hover:bg-blue-50 flex items-center gap-2">
                    <FaUser className="text-blue-500" /> ข้อมูลของฉัน
                  </a>
                  <a href="/booking-history" className="block px-4 py-2 hover:bg-blue-50 flex items-center gap-2">
                    <FaHistory className="text-blue-500" /> ประวัติการจอง
                  </a>
                  <a href="/policy" className="block px-4 py-2 hover:bg-blue-50 flex items-center gap-2">
                    <FaFileAlt className="text-blue-500" /> นโยบาย
                  </a>
                  <a href="/support" className="block px-4 py-2 hover:bg-blue-50 flex items-center gap-2">
                    <FaQuestionCircle className="text-blue-500" /> ศูนย์ช่วยเหลือ
                  </a>
                  <a href="/report" className="block px-4 py-2 hover:bg-blue-50 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-500" /> รายงาน
                  </a>
                  <button
                    onClick={() => {
                      localStorage.removeItem("userId");
                      location.href = "/login";
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FaSignOutAlt /> ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <a href="/login" className="text-blue-500 hover:underline mr-4">เข้าสู่ระบบ</a>
              <a href="/register" className="text-blue-500 hover:underline">สมัครสมาชิก</a>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
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
          {subjects.map((subject, idx) => (
            <div
              key={idx}
              className="bg-white border border-blue-200 text-blue-700 text-center p-4 rounded-lg shadow hover:bg-blue-50 cursor-pointer transition"
            >
              {subject}
            </div>
          ))}
        </div>
      </section>

      {/* Tutor Grid */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">ติวเตอร์แนะนำ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutors.map((tutor, i) => (
            <div key={i} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-200 text-blue-700 flex items-center justify-center text-xl font-bold rounded-full">
                  {tutor.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{tutor.name}</h3>
                  <p className="text-sm text-gray-600">{tutor.subject || "ไม่ระบุวิชา"}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                ประสบการณ์ {tutor.experience_years || 0} ปี
              </p>
              <div className="flex items-center text-yellow-500 mb-2">
                <FaStar className="mr-1" />
                {tutor.rating_average?.toFixed(1) || "0.0"} / 5.0
              </div>
              <div className="text-blue-600 font-semibold mb-2">
                {tutor.rate_per_hour || 500} บาท/ชั่วโมง
              </div>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full transition">
                จองติวเตอร์
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-400 text-white py-6 text-center mt-auto">
        Tutor Platform © {new Date().getFullYear()} | Powered by Fruitables UI
      </footer>
    </div>
  );
}