"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import BackButton from "@/app/components/BackButton";

export default function NewCoursePage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    subject_id: "",
    course_title: "",
    course_description: "",
    rate_per_hour: "",
    teaching_method: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { label: "คอร์สของฉัน", path: "/tutor/courses" },
    { label: "บัญชีของฉัน", path: "/hometutor" },
    { label: "ออกจากระบบ", onClick: () => {
        localStorage.removeItem("userId");
        router.push("/login");
      }
    },
  ];

  useEffect(() => {
    fetch("/api/subjects")
      .then(r => r.json())
      .then(setSubjects)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const res = await fetch(`/api/tutor/${userId}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/tutor/courses");
    } else {
      const err = await res.json();
      alert("❌ " + err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header dropdownItems={menuItems} />

      <div className="max-w-3xl mx-auto py-8 px-6">
        <BackButton>ย้อนกลับ</BackButton>
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-4">
          <h2 className="text-2xl font-semibold mb-6">➕ เพิ่มคอร์สใหม่</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* วิชา */}
            <div>
              <label className="block mb-1">วิชา</label>
              <select
                name="subject_id"
                value={form.subject_id}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              >
                <option value="">-- เลือกวิชา --</option>
                {subjects.map(s => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ชื่อคอร์ส */}
            <div>
              <label className="block mb-1">ชื่อคอร์ส</label>
              <input
                name="course_title"
                value={form.course_title}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            {/* รายละเอียด (เต็มความกว้าง) */}
            <div className="md:col-span-2">
              <label className="block mb-1">รายละเอียด</label>
              <textarea
                name="course_description"
                value={form.course_description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>

            {/* ราคา */}
            <div>
              <label className="block mb-1">ราคา (บาท/ชม.)</label>
              <input
                name="rate_per_hour"
                type="number"
                value={form.rate_per_hour}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            {/* วิธีการสอน */}
            <div>
              <label className="block mb-1">วิธีการสอน</label>
              <select
                name="teaching_method"
                value={form.teaching_method}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              >
                <option value="">-- เลือกวิธี --</option>
                <option value="online">ออนไลน์</option>
                <option value="offline">ออฟไลน์</option>
              </select>
            </div>

            {/* ระดับ */}
            <div>
              <label className="block mb-1">ระดับ</label>
              <input
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            {/* ปุ่มบันทึก */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
              >
                {loading ? "⌛ กำลังบันทึก..." : "💾 บันทึกคอร์ส"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
