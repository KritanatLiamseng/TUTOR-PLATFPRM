"use client";
import { useEffect, useState } from "react";
import Header from "../components/header";
import FooterNav from "@/app/components/FooterNav";
import {
  FaFlask, FaGlobe, FaCalculator, FaCode, FaMusic,
  FaHistory, FaPaintBrush, FaLanguage
} from "react-icons/fa";

export default function HomePage() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetch("/api/tutors") // <- ต้องมี endpoint นี้ให้เรียกข้อมูลติวเตอร์
      .then((res) => res.json())
      .then((data) => setTutors(data))
      .catch((err) => console.error("โหลดข้อมูลติวเตอร์ล้มเหลว", err));
  }, []);

  const subjects = [
    { name: "คณิตศาสตร์", icon: <FaCalculator /> },
    { name: "วิทยาศาสตร์", icon: <FaFlask /> },
    { name: "ภาษาอังกฤษ", icon: <FaLanguage /> },
    { name: "สังคมศึกษา", icon: <FaGlobe /> },
    { name: "คอมพิวเตอร์", icon: <FaCode /> },
    { name: "ศิลปะ", icon: <FaPaintBrush /> },
    { name: "ประวัติศาสตร์", icon: <FaHistory /> },
    { name: "ดนตรี", icon: <FaMusic /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col">
      <Header />

      {/* แถบแจ้งเตือน */}
      <div className="bg-blue-500 text-white py-2 text-center text-sm">
        📢 โฆษณาแพลตฟอร์มติวเตอร์ พร้อมเรียนกับติวเตอร์คุณภาพแล้ววันนี้!
      </div>

      {/* หมวดวิชา */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {subjects.map((subject, idx) => (
          <div key={idx} className="bg-white shadow rounded-xl p-4 flex items-center gap-3 hover:bg-blue-100 transition">
            <div className="text-xl text-blue-500">{subject.icon}</div>
            <span className="text-gray-700 font-medium">{subject.name}</span>
          </div>
        ))}
      </div>

      {/* รายชื่อติวเตอร์แนะนำ */}
      <div className="px-4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">📚 รายชื่อติวเตอร์แนะนำ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutors.length > 0 ? (
            tutors.map((tutor, index) => (
              <div key={index} className="bg-white shadow-md rounded-xl p-4">
                <h3 className="text-lg font-bold text-blue-700">{tutor.name}</h3>
                <p className="text-sm text-gray-600">{tutor.subject}</p>
                <p className="text-sm text-gray-600">ประสบการณ์ {tutor.experience_years} ปี</p>
                <p className="text-green-600 font-semibold mt-2">
                  {tutor.price || 500} บาท/ชม.
                </p>
                <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  จองติวเตอร์
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">ไม่มีข้อมูลติวเตอร์ในขณะนี้</p>
          )}
        </div>
      </div>

      <FooterNav active="Home" />
    </div>
  );
}
