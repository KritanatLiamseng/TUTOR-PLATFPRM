"use client"; // ✅ เพิ่ม "use client" เพื่อให้ใช้ useState ได้

import FooterNav from "../components/FooterNav";
import { useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Booking() {
  const [upcomingCourses, setUpcomingCourses] = useState([
    { id: 1, name: "คณิตศาสตร์ ม.ปลาย", tutor: "ครูเอก", date: "12 มี.ค. 2025", time: "18:00 - 19:30", price: "500 บาท" },
    { id: 2, name: "วิทยาศาสตร์ ฟิสิกส์", tutor: "ครูสมชาย", date: "15 มี.ค. 2025", time: "10:00 - 12:00", price: "600 บาท" }
  ]);

  const [completedCourses] = useState([
    { id: 3, name: "ภาษาอังกฤษเพื่อสอบ TOEIC", tutor: "ครูสุนีย์", date: "5 มี.ค. 2025", time: "14:00 - 16:00", price: "550 บาท" }
  ]);

  const cancelCourse = (id) => {
    setUpcomingCourses(upcomingCourses.filter(course => course.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
      
      <header className="bg-white/50 backdrop-blur-lg shadow-md p-6 flex items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-700">📅 การจองของฉัน</h2>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto p-6">
        
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📌 คอร์สที่กำลังจะเรียน</h3>
          {upcomingCourses.length > 0 ? (
            upcomingCourses.map(course => (
              <div key={course.id} className="bg-white/50 backdrop-blur-lg p-4 rounded-lg shadow-md mb-4">
                <h4 className="text-lg font-bold">{course.name}</h4>
                <p className="text-gray-600">👨‍🏫 {course.tutor}</p>
                <p className="text-gray-600"><FaCalendarAlt className="inline-block mr-2 text-blue-500" /> {course.date} | {course.time}</p>
                <p className="text-green-500 font-semibold">{course.price}</p>
                <button
                  onClick={() => cancelCourse(course.id)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
                >
                  <FaTimesCircle className="mr-2" /> ยกเลิกการจอง
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">ไม่มีคอร์สที่กำลังจะเรียน</p>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📚 คอร์สที่เรียนไปแล้ว</h3>
          {completedCourses.length > 0 ? (
            completedCourses.map(course => (
              <div key={course.id} className="bg-white/50 backdrop-blur-lg p-4 rounded-lg shadow-md mb-4">
                <h4 className="text-lg font-bold">{course.name}</h4>
                <p className="text-gray-600">👨‍🏫 {course.tutor}</p>
                <p className="text-gray-600"><FaCalendarAlt className="inline-block mr-2 text-green-500" /> {course.date} | {course.time}</p>
                <p className="text-green-500 font-semibold">{course.price}</p>
                <div className="text-green-600 font-semibold mt-2 flex items-center">
                  <FaCheckCircle className="mr-2" /> เรียบร้อยแล้ว
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">ยังไม่มีคอร์สที่เรียนจบ</p>
          )}
        </section>

      </main>

      <FooterNav />
    </div>
  );
}
