// File: src/app/tutor/courses/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import BackButton from "@/app/components/BackButton";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function TutorCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // เมนูด้านบน
  const menuItems = [
    { label: "คอร์สของฉัน", path: "/tutor/courses" },
    { label: "บัญชีของฉัน", path: "/hometutor" },
    {
      label: "ออกจากระบบ",
      onClick: () => {
        localStorage.removeItem("userId");
        router.push("/login");
      },
    },
  ];

  // โหลดคอร์ส
  useEffect(() => {
    async function load() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/tutor/${userId}/courses`);
        const data = res.ok ? await res.json() : [];
        setCourses(data);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ลบคอร์ส
  const handleDelete = async (courseId) => {
    if (!confirm("ต้องการลบคอร์สนี้ใช่หรือไม่?")) return;
    const userId = localStorage.getItem("userId");
    const res = await fetch(`/api/tutor/${userId}/courses/${courseId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
    } else {
      const err = await res.json();
      alert("❌ " + (err.error || "ลบไม่สำเร็จ"));
    }
  };

  if (loading) {
    return <p className="text-center py-10">กำลังโหลดคอร์ส...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header dropdownItems={menuItems} />
      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <BackButton onClick={() => router.back()}>← ย้อนกลับ</BackButton>
          <h1 className="text-2xl font-semibold text-gray-800">คอร์สของฉัน</h1>
          {/* เปลี่ยนแค่ตรงนี้ */}
          <button
            onClick={() => router.push("/tutor/courses/new")}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <FaPlus /> เพิ่มคอร์สใหม่
          </button>
        </div>

        {courses.length === 0 ? (
          <p className="text-center text-gray-500">ยังไม่มีคอร์สเปิดสอน</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div
                key={c.course_id}
                className="bg-white rounded-xl shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{c.course_title}</h2>
                  <p className="text-sm text-gray-600">วิชา: {c.subject_name}</p>
                  <p className="text-sm text-gray-600">ราคา: {c.rate_per_hour} บาท/ชม.</p>
                </div>
                <div className="mt-4 flex gap-2">
                  {/* แก้ตรงนี้ */}
                  <button
                    onClick={() => router.push(`/tutor/courses/${c.course_id}/edit`)}
                    className="flex-1 inline-flex items-center justify-center gap-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <FaEdit /> แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(c.course_id)}
                    className="flex-1 inline-flex items-center justify-center gap-1 border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50"
                  >
                    <FaTrash /> ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
