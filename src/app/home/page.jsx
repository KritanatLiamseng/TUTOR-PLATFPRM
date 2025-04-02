"use client";
import { useState } from 'react';
import {
  FaUserCircle, FaComments, FaSlidersH, FaCalculator,
  FaFlask, FaLanguage, FaGlobe, FaCode,
  FaPaintBrush, FaHistory, FaMusic
} from 'react-icons/fa';
import Link from 'next/link';
import FooterNav from '@/app/components/FooterNav';

export default function Home() {
  const allSubjects = [
    { name: 'คณิตศาสตร์', icon: <FaCalculator /> },
    { name: 'วิทยาศาสตร์', icon: <FaFlask /> },
    { name: 'ภาษาอังกฤษ', icon: <FaLanguage /> },
    { name: 'สังคมศึกษา', icon: <FaGlobe /> },
    { name: 'คอมพิวเตอร์', icon: <FaCode /> },
    { name: 'ศิลปะ', icon: <FaPaintBrush /> },
    { name: 'ประวัติศาสตร์', icon: <FaHistory /> },
    { name: 'ดนตรี', icon: <FaMusic /> },
  ];

  const tutors = [
    {
      name: "ครูเอก คณิต",
      subject: "คณิตศาสตร์",
      experience: "5 ปี",
      rate: "500 บาท/ชม.",
      icon: <FaCalculator className="text-blue-500" />,
    },
    {
      name: "ครูสมชาย วิทย์",
      subject: "วิทยาศาสตร์",
      experience: "3 ปี",
      rate: "400 บาท/ชม.",
      icon: <FaFlask className="text-green-500" />,
    },
    {
      name: "ครูสุนีย์ ภาษา",
      subject: "ภาษาอังกฤษ",
      experience: "4 ปี",
      rate: "450 บาท/ชม.",
      icon: <FaLanguage className="text-red-500" />,
    },
    {
      name: "ครูวิชัย คอมพ์",
      subject: "คอมพิวเตอร์",
      experience: "6 ปี",
      rate: "600 บาท/ชม.",
      icon: <FaCode className="text-purple-500" />,
    },
  ];

  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <FaUserCircle className="text-3xl text-gray-600 mr-2" />
          <div>
            <span className="text-base font-semibold text-gray-800 block">ชื่อผู้ใช้</span>
            <Link href="/login">
              <button className="text-sm text-blue-600 hover:underline mt-1">เข้าสู่ระบบ/สมัคร</button>
            </Link>
          </div>
        </div>
        <button className="text-gray-600 hover:text-blue-500 transition">
          <FaComments className="text-xl" />
        </button>
      </header>

      {/* Banner */}
      <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl shadow-xl text-white text-center">
        <span className="text-md font-semibold tracking-wide">📢 โปรโมทแพลตฟอร์มติวเตอร์ พร้อมเรียนกับติวเตอร์คุณภาพแล้ววันนี้!</span>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Filter */}
        <div
          className="flex items-center gap-2 mb-4 cursor-pointer text-blue-700 hover:text-blue-900"
          onClick={() => setShowFilter(!showFilter)}
        >
          <FaSlidersH className="text-lg" />
          <span className="text-lg font-bold tracking-wide">🔍 เลือกวิชาเรียนที่คุณสนใจ</span>
        </div>

        {/* Subjects */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {allSubjects.map((subject, index) => (
            <div
              key={index}
              className="bg-gradient-to-tr from-white to-blue-50 hover:from-blue-100 hover:to-white p-5 rounded-2xl shadow-md text-center border border-blue-100 transition-all duration-200 ease-in-out transform hover:scale-[1.03]"
            >
              <div className="text-2xl mb-1 text-blue-600">{subject.icon}</div>
              <span className="text-sm font-semibold text-gray-700">{subject.name}</span>
            </div>
          ))}
        </div>

        {/* Recommended Tutors */}
        <h3 className="text-lg font-bold mb-4 text-gray-800">👨‍🏫 รายชื่อติวเตอร์แนะนำ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tutors.map((tutor, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl mb-2">{tutor.icon}</div>
                <h4 className="text-lg font-bold text-gray-800">{tutor.name}</h4>
                <p className="text-sm text-gray-600">{tutor.subject}</p>
                <p className="text-sm text-gray-500">ประสบการณ์: {tutor.experience}</p>
                <p className="text-base text-green-600 font-semibold mt-1">{tutor.rate}</p>
                <button className="mt-3 px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm shadow-md">
                  จองติวเตอร์
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Navigation */}
      <FooterNav />
    </div>
  );
}
