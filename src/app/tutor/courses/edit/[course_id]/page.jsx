"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/app/components/header";
import BackButton from "@/app/components/BackButton";

export default function EditCoursePage() {
  const router = useRouter();
  const { course_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    subject_id:         "",
    course_title:       "",
    course_description: "",
    rate_per_hour:      "",
    teaching_method:    "",
    level:              "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // โหลดรายการวิชา
    fetch("/api/subjects")
      .then(res => res.json())
      .then(setSubjects)
      .catch(console.error);

    // โหลดข้อมูลคอร์สเดิม
    fetch(`/api/tutor/${userId}/courses/${course_id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setForm({
          subject_id:         data.subject_id || "",
          course_title:       data.course_title || "",
          course_description: data.course_description || "",
          rate_per_hour:      data.rate_per_hour?.toString() || "",
          teaching_method:    data.teaching_method || "",
          level:              data.level || "",
        });
      })
      .catch(() => alert("โหลดข้อมูลคอร์สล้มเหลว"))
      .finally(() => setLoading(false));
  }, [course_id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const res = await fetch(`/api/tutor/${userId}/courses/${course_id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        ...form,
        rate_per_hour: Number(form.rate_per_hour),
      }),
    });
    setLoading(false);

    if (res.ok) {
      router.push("/tutor/courses");
    } else {
      const err = await res.json();
      alert("❌ อัปเดตล้มเหลว: " + err.error);
    }
  };

  const menuItems = [
    { label: "คอร์สของฉัน", path: "/tutor/courses" },
    { label: "บัญชีของฉัน", path: "/hometutor" },
    { label: "ออกจากระบบ", onClick: () => {
        localStorage.removeItem("userId");
        router.push("/login");
      }
    },
  ];

  if (loading) {
    return <p className="text-center text-gray-500 py-10">กำลังโหลดข้อมูล...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header dropdownItems={menuItems} />

      <div className="max-w-3xl mx-auto py-8 px-6">
        <BackButton>ย้อนกลับ</BackButton>

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-4">
          <h2 className="text-2xl font-semibold mb-6">✏️ แก้ไขคอร์ส</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* วิชา */}
            <div>
              <label className="block mb-1 text-gray-700">วิชา</label>
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
              <label className="block mb-1 text-gray-700">ชื่อคอร์ส</label>
              <input
                name="course_title"
                value={form.course_title}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            {/* รายละเอียด (เต็มแถว) */}
            <div className="md:col-span-2">
              <label className="block mb-1 text-gray-700">รายละเอียด</label>
              <textarea
                name="course_description"
                value={form.course_description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>

            {/* ค่าบริการ */}
            <div>
              <label className="block mb-1 text-gray-700">ราคา (บาท/ชม.)</label>
              <input
                name="rate_per_hour"
                type="number"
                min="0"
                value={form.rate_per_hour}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            {/* วิธีการสอน */}
            <div>
              <label className="block mb-1 text-gray-700">วิธีการสอน</label>
              <select
                name="teaching_method"
                value={form.teaching_method}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              >
                <option value="">-- เลือกวิธีการสอน --</option>
                <option value="online">ออนไลน์</option>
                <option value="offline">ออฟไลน์</option>
              </select>
            </div>

            {/* ระดับ */}
            <div>
              <label className="block mb-1 text-gray-700">ระดับ</label>
              <input
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                placeholder="เช่น ม.4"
                required
              />
            </div>

            {/* ปุ่มบันทึก */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                💾 บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
