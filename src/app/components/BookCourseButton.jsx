"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookCourseButton({ tutorId, courseId, rate }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBook = async () => {
    const studentId = localStorage.getItem("userId");
    if (!studentId) {
      alert("กรุณาเข้าสู่ระบบก่อนจอง");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          tutor_id: tutorId,
          course_id: courseId,
          schedule_time: new Date().toISOString(),
          total_amount: rate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      // จองสำเร็จ ไปหน้า Booking History
      router.push("/booking-history");
    } catch (err) {
      alert("การจองไม่สำเร็จ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBook}
      disabled={loading}
      className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "กำลังจอง..." : "จองคอร์สนี้"}
    </button>
  );
}
