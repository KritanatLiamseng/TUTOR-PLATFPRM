
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.course_id;

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

  useEffect(() => {
    if (!courseId) return;
    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects)
      .catch((err) => console.error("โหลดวิชา error", err));

    fetch(`/api/tutor/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          subject_id: data.subject_id,
          course_title: data.course_title,
          course_description: data.course_description,
          rate_per_hour: data.rate_per_hour,
          teaching_method: data.teaching_method,
          level: data.level,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("โหลดคอร์ส error", err);
        setLoading(false);
      });
  }, [courseId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/tutor/courses/${courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/hometutor");
    } else {
      const error = await res.json();
      alert("❌ อัปเดตล้มเหลว: " + error.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-6">✏️ แก้ไขคอร์ส</h2>
      {loading ? (
        <p className="text-center">กำลังโหลด...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">ชื่อวิชา</label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">-- เลือกวิชา --</option>
              {subjects.map((subject) => (
                <option key={subject.subject_id} value={subject.subject_id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">ชื่อคอร์ส</label>
            <input
              name="course_title"
              type="text"
              value={formData.course_title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">รายละเอียด</label>
            <textarea
              name="course_description"
              value={formData.course_description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">ค่าบริการ (บาท/ชม)</label>
            <input
              name="rate_per_hour"
              type="number"
              value={formData.rate_per_hour}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">วิธีการสอน</label>
            <input
              name="teaching_method"
              type="text"
              value={formData.teaching_method}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">ระดับชั้น</label>
            <input
              name="level"
              type="text"
              value={formData.level}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            💾 {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
        </form>
      )}
    </div>
  );
}
