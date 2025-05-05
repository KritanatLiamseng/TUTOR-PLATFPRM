"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/app/components/header";
import BackButton from "@/app/components/BackButton";

export default function EditCoursePage() {
  const router       = useRouter();
  const { course_id } = useParams();

  const [loading, setLoading]   = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [error, setError]       = useState("");
  const [form, setForm]         = useState({
    subject_id:         "",
    course_title:       "",
    course_description: "",
    rate_per_hour:      "",
    teaching_method:    "",
    level:              "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        // ดึงหมวดวิชา
        const resp1 = await fetch("/api/subjects");
        if (!resp1.ok) throw new Error("โหลดหมวดหมู่ไม่สำเร็จ");
        setSubjects(await resp1.json());

        // ดึงข้อมูลคอร์ส
        const resp2 = await fetch(`/api/tutor/${userId}/courses/${course_id}`);
        if (!resp2.ok) throw new Error("โหลดข้อมูลคอร์สไม่สำเร็จ");
        const course = await resp2.json();

        setForm({
          subject_id:         course.subject_id?.toString() || "",
          course_title:       course.course_title || "",
          course_description: course.course_description || "",
          rate_per_hour:      course.rate_per_hour?.toString() || "",
          teaching_method:    course.teaching_method || "",
          level:              course.level || "",
        });
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [course_id, router]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem("userId");

    try {
      const res = await fetch(`/api/tutor/${userId}/courses/${course_id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id:         Number(form.subject_id),
          course_title:       form.course_title,
          course_description: form.course_description,
          rate_per_hour:      Number(form.rate_per_hour),
          teaching_method:    form.teaching_method,
          level:              form.level,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error || "อัปเดตคอร์สไม่สำเร็จ");
      }
      // เปลี่ยนเส้นทางกลับไปที่รายการคอร์ส
      router.push("/tutor/courses");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { label: "คอร์สของฉัน", path: "/tutor/courses" },
    { label: "บัญชีของฉัน", path: "/hometutor" },
    { 
      label: "ออกจากระบบ", 
      onClick: () => {
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
        {/* ปุ่มย้อนกลับ → ไปที่ /tutor/courses */}
        <BackButton onClick={() => router.push("/tutor/courses")}>
          ← ย้อนกลับ
        </BackButton>

        {error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : (
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
              {/* รายละเอียด */}
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
              {/* ราคา */}
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
        )}
      </div>
    </div>
  );
}
