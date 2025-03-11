"use client";
import { useState } from 'react';
import { 
    FaUserCircle, FaComments, FaSlidersH, FaCalculator, 
    FaFlask, FaLanguage, FaGlobe, FaCode, FaPaintBrush, FaHistory, FaMusic 
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
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
    { name: 'ดนตรี', icon: <FaMusic /> }
  ];

  const tutors = [
    {
      name: "ครูเอก คณิต",
      subject: "คณิตศาสตร์",
      experience: "5 ปี",
      rate: "500 บาท/ชม.",
      icon: <FaCalculator className="text-blue-500" />
    },
    {
      name: "ครูสมชาย วิทย์",
      subject: "วิทยาศาสตร์",
      experience: "3 ปี",
      rate: "400 บาท/ชม.",
      icon: <FaFlask className="text-green-500" />
    },
    {
      name: "ครูสุนีย์ ภาษา",
      subject: "ภาษาอังกฤษ",
      experience: "4 ปี",
      rate: "450 บาท/ชม.",
      icon: <FaLanguage className="text-red-500" />
    },
    {
      name: "ครูวิชัย คอมพ์",
      subject: "คอมพิวเตอร์",
      experience: "6 ปี",
      rate: "600 บาท/ชม.",
      icon: <FaCode className="text-purple-500" />
    }
  ];

  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
      
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-lg shadow-md p-4 flex items-center justify-between rounded-b-2xl">
        <div className="flex items-center">
          <FaUserCircle className="text-4xl text-gray-600 mr-2" />
          <div>
            <span className="text-lg font-semibold text-black block">ชื่อผู้ใช้</span>
            <Link href="/login">
              <button className="bg-blue-500 text-white px-3 py-1 mt-1 text-sm rounded-lg hover:bg-blue-600 transition">
                เข้าสู่ระบบ/สมัคร
              </button>
            </Link>
          </div>
        </div>
        <button className="text-gray-600 hover:text-blue-500 transition">
          <FaComments className="text-2xl" />
        </button>
      </header>

      {/* แบนเนอร์ */}
      <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white text-center py-4 rounded-xl shadow-lg mx-4 mt-4">
        <span className="text-lg font-semibold">📢 โปรโมทแพลตฟอร์มติวเตอร์!</span>
      </div>

      {/* เนื้อหาหลัก */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">

        {/* ปุ่ม Filter */}
        <div 
          className="flex items-center mb-4 cursor-pointer hover:text-blue-500 transition" 
          onClick={() => setShowFilter(!showFilter)}
        >
          <FaSlidersH className="text-2xl mr-2" />
          <span className="text-lg font-medium">เลือกวิชาเรียน</span>
        </div>

        {/* แสดงไอคอนของวิชาต่างๆ */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {allSubjects.map((subject, index) => (
            <div 
              key={index} 
              className="bg-white/50 backdrop-blur-lg p-4 rounded-lg shadow-md text-center flex flex-col items-center cursor-pointer hover:bg-blue-100 transition"
            >
              <div className="text-3xl mb-1">{subject.icon}</div>
              <span className="text-sm font-semibold">{subject.name}</span>
            </div>
          ))}
        </div>

        {/* รายชื่อติวเตอร์ */}
        <h3 className="text-lg font-bold mb-4 text-gray-700">👨‍🏫 รายชื่อติวเตอร์แนะนำ</h3>
        <div className="grid grid-cols-2 gap-4">
          {tutors.map((tutor, index) => (
            <div 
              key={index} 
              className="bg-white/50 backdrop-blur-lg p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-blue-50 transition"
            >
              <div className="text-4xl mb-2">{tutor.icon}</div>
              <h4 className="text-md font-bold">{tutor.name}</h4>
              <p className="text-sm text-gray-600">{tutor.subject}</p>
              <p className="text-sm text-gray-500">ประสบการณ์: {tutor.experience}</p>
              <p className="text-sm text-green-500 font-semibold">{tutor.rate}</p>
            </div>
          ))}
        </div>

      </main>

      {/* Footer Navigation */}
      <FooterNav />
    </div>
  );
}
