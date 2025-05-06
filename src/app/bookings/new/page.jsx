// File: src/app/bookings/new/page.jsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function NewBookingPage() {
  const router      = useRouter();
  const params      = useSearchParams();
  const courseId    = Number(params.get("course"));

  const [course, setCourse]           = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [loading, setLoading]         = useState(false);

  // 1) ดึงข้อมูลคอร์ส + tutor
  useEffect(() => {
    if (!courseId) return router.back();
    fetch(`/api/course/${courseId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCourse(data);
      })
      .catch((err) => {
        alert("❌ " + err.message);
        router.back();
      });
  }, [courseId, router]);

  // 2) ฟังก์ชันส่งข้อมูลจอง
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate) {
      alert("กรุณาเลือกวันและเวลาจอง");
      return;
    }
    const student_id = Number(localStorage.getItem("userId"));
    if (!student_id) {
      alert("กรุณาเข้าสู่ระบบก่อนจึงจองได้");
      return router.push("/login");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id,
          course_id: courseId,
          booking_date: bookingDate,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Unknown error");
      }
      alert("✅ จองสำเร็จ!");
      router.push("/booking-history");
    } catch (err) {
      alert("❌ จองไม่สำเร็จ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">กำลังโหลดข้อมูลคอร์ส…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl p-10 rounded-2xl shadow-xl space-y-8">
        {/* ข้อมูลคอร์ส + ติวเตอร์ */}
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold mb-4">{course.course_title}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={course.tutor.profile_image || "/default-profile.png"}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div>
              <p className="text-xl font-semibold">
                {course.tutor.name} {course.tutor.surname}
              </p>
              <p className="text-sm text-gray-500">ติวเตอร์ผู้สอน</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 mb-1">
            <strong>วิชา:</strong> {course.subject_name} ({course.level})
          </p>
          <p className="text-lg text-gray-700">
            <strong>ราคา:</strong> {course.rate_per_hour} ฿/ชม&nbsp;|&nbsp;
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {course.teaching_method === "online" ? "ออนไลน์" : "ออฟไลน์"}
            </span>
          </p>
        </div>

        {/* ฟอร์มเลือกวันและเวลา */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-lg font-medium text-gray-700">วันและเวลา</span>
            <input
              type="datetime-local"
              step={900}  // 900 วินาที = 15 นาที
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
              className="
                mt-2 block w-full border border-gray-300 rounded-lg
                px-4 py-3 text-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
          </label>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="
                px-6 py-3 border border-gray-300 rounded-lg
                hover:bg-gray-50 font-medium
              "
            >
              ย้อนกลับ
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`
                px-8 py-3 rounded-lg text-white text-lg font-medium
                ${loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              {loading ? "กำลังส่ง…" : "ยืนยันการจอง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
