"use client";
import { useEffect, useState } from "react";
import Header from "../components/header";
import FooterNav from "@/app/components/FooterNav";
import {
  FaFlask, FaGlobe, FaCalculator, FaCode, FaMusic,
  FaHistory, FaPaintBrush, FaLanguage, FaSearch
} from "react-icons/fa";

export default function HomePage() {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [filter, setFilter] = useState({ subject: "", minRating: 0 });

  useEffect(() => {
    fetch("/api/tutors")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 ได้ข้อมูลติวเตอร์:", data);
        setTutors(data);
        setFilteredTutors(data);
      })
      .catch((err) => console.error("โหลดข้อมูลติวเตอร์ล้มเหลว", err));
  }, []);

  useEffect(() => {
    const results = tutors.filter((tutor) => {
      const subjectMatch =
        filter.subject === "" ||
        (tutor.subject || "").toLowerCase().includes(filter.subject.toLowerCase());

      const ratingMatch =
        (tutor.rating_average || 0) >= filter.minRating;

      return subjectMatch && ratingMatch;
    });

    setFilteredTutors(results);
  }, [filter, tutors]);

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

      {/* ตัวกรองค้นหา */}
      <div className="px-4 py-4 bg-white shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">ค้นหาตามวิชา</label>
            <input
              type="text"
              placeholder="เช่น คณิตศาสตร์"
              className="w-full mt-1 px-3 py-2 border rounded-md"
              onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">คะแนนรีวิวขั้นต่ำ</label>
            <select
              className="w-full mt-1 px-3 py-2 border rounded-md"
              onChange={(e) => setFilter({ ...filter, minRating: Number(e.target.value) })}
            >
              <option value="0">ทั้งหมด</option>
              <option value="3">3 ดาวขึ้นไป</option>
              <option value="4">4 ดาวขึ้นไป</option>
              <option value="4.5">4.5 ดาวขึ้นไป</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setFilter({ subject: "", minRating: 0 })}
              className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              รีเซตตัวกรอง
            </button>
          </div>
        </div>
      </div>

      {/* หมวดวิชา */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {subjects.map((subject, idx) => (
          <div
            key={idx}
            onClick={() => setFilter({ ...filter, subject: subject.name })}
            className="bg-white shadow rounded-xl p-4 flex items-center gap-3 hover:bg-blue-100 transition cursor-pointer"
          >
            <div className="text-xl text-blue-500">{subject.icon}</div>
            <span className="text-gray-700 font-medium">{subject.name}</span>
          </div>
        ))}
      </div>

      {/* รายชื่อติวเตอร์แนะนำ */}
      <div className="px-4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">📚 รายชื่อติวเตอร์แนะนำ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTutors.length > 0 ? (
            filteredTutors.map((tutor, index) => (
              <div key={index} className="bg-white shadow-md rounded-xl p-4">
                <h3 className="text-lg font-bold text-blue-700">{tutor.name}</h3>
                <p className="text-sm text-gray-600">{tutor.subject}</p>
                <p className="text-sm text-gray-600">ประสบการณ์ {tutor.experience_years} ปี</p>
                <p className="text-sm text-yellow-600">คะแนนรีวิว: {tutor.rating_average?.toFixed(1) || "0.0"} ⭐</p>
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
