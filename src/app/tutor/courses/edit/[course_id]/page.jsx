"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditCoursePage() {
  const router = useRouter();
  const { course_id: courseId } = useParams();
  const [userId, setUserId] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subject_id: "",
    course_title: "",
    course_description: "",
    rate_per_hour: "",
    teaching_method: "",
    level: "",
  });
  const [loading, setLoading] = useState(true);

  // โหลด userId จาก localStorage
  useEffect(() => {
    const u = localStorage.getItem("userId");
    if (u) setUserId(u);
  }, []);

  // เมื่อมี userId + courseId แล้ว ค่อย fetch ข้อมูล
  useEffect(() => {
    if (!userId || !courseId) return;

    // ดึงรายการวิชา
    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects)
      .catch((err) => console.error("โหลดวิชา error:", err));

    // ดึงข้อมูลคอร์สที่ต้องแก้ไข
    fetch(`/api/tutor/${userId}/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFormData({
          subject_id:        data.subject_id,
          course_title:      data.course_title,
          course_description: data.course_description || "",
          rate_per_hour:     data.rate_per_hour,
          teaching_method:   data.teaching_method,
          level:             data.level,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("โหลดคอร์ส error:", err);
        setLoading(false);
      });
  }, [userId, courseId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(
      `/api/tutor/${userId}/courses/${courseId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (res.ok) {
      router.push("/hometutor");
    } else {
      const err = await res.json();
      alert("❌ อัปเดตล้มเหลว: " + err.error);
    }

    setLoading(false);
  };

  if (loading) {
    return <p className="text-center mt-10">กำลังโหลด...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-6">
        ✏️ แก้ไขคอร์ส
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1) ชื่อวิชา */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            ชื่อวิชา
          </label>
          <select
            name="subject_id"
            value={formData.subject_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">-- เลือกวิชา --</option>
            {subjects.map((s) => (
              <option key={s.subject_id} value={s.subject_id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2) ชื่อคอร์ส */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            ชื่อคอร์ส
          </label>
          <input
            name="course_title"
            type="text"
            value={formData.course_title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* 3) รายละเอียด */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            รายละเอียด
          </label>
          <textarea
            name="course_description"
            value={formData.course_description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* 4) ค่าบริการ */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            ค่าบริการ (บาท/ชม)
          </label>
          <input
            name="rate_per_hour"
            type="number"
            value={formData.rate_per_hour}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            min="0"
            required
          />
        </div>

        {/* 5) วิธีการสอน */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            วิธีการสอน
          </label>
          <select
            name="teaching_method"
            value={formData.teaching_method}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">-- เลือกวิธีการสอน --</option>
            <option value="online">ออนไลน์</option>
            <option value="offline">ออฟไลน์</option>
          </select>
        </div>

        {/* 6) ระดับชั้น */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            ระดับชั้น
          </label>
          <input
            name="level"
            type="text"
            value={formData.level}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* ปุ่มบันทึก */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          💾 บันทึกการแก้ไข
        </button>
      </form>
    </div>
  );
}
