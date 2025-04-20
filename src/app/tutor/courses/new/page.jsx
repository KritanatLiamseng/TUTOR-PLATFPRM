
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [ratePerHour, setRatePerHour] = useState("");
  const [teachingMethod, setTeachingMethod] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects)
      .catch((err) => console.error("โหลดวิชาผิดพลาด", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setLoading(true);

    const res = await fetch(`/api/tutor/${userId}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject_id: subjectId,
        course_title: courseTitle,
        course_description: courseDescription,
        rate_per_hour: ratePerHour,
        teaching_method: teachingMethod,
        level,
      }),
    });

    if (res.ok) {
      router.push("/hometutor");
    } else {
      const error = await res.json();
      alert("❌ เพิ่มคอร์สไม่สำเร็จ: " + error.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-6">➕ เพิ่มคอร์สใหม่</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">ชื่อวิชา</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
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
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">รายละเอียด</label>
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">ค่าบริการ (บาท/ชม)</label>
          <input
            type="number"
            value={ratePerHour}
            onChange={(e) => setRatePerHour(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">วิธีการสอน</label>
          <input
            type="text"
            value={teachingMethod}
            onChange={(e) => setTeachingMethod(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">ระดับชั้น</label>
          <input
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          ✅ {loading ? "กำลังบันทึก..." : "บันทึกคอร์ส"}
        </button>
      </form>
    </div>
  );
}
