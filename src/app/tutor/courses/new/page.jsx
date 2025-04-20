"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
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

    if (!courseTitle || !description || !ratePerHour || !teachingMethod || !level || !subjectId) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/tutor/${userId}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject_id: subjectId,
        course_title: courseTitle,
        course_description: description,
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
        <label className="block">
          วิชา
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded"
            required
          >
            <option value="">-- เลือกวิชา --</option>
            {subjects.map((subj) => (
              <option key={subj.subject_id} value={subj.subject_id}>
                {subj.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          ชื่อคอร์ส
          <input
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded"
            required
          />
        </label>

        <label className="block">
          รายละเอียด
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded"
            required
          />
        </label>

        <label className="block">
          อัตราค่าบริการ (บาท/ชม)
          <input
            type="number"
            value={ratePerHour}
            onChange={(e) => setRatePerHour(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded"
            required
          />
        </label>

        <label className="block">
          วิธีการสอน
          <input
            value={teachingMethod}
            onChange={(e) => setTeachingMethod(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded"
            required
          />
        </label>

        <label className="block">
          ระดับชั้น
          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg"
        >
          ✅ {loading ? "กำลังบันทึก..." : "บันทึกคอร์ส"}
        </button>
      </form>
    </div>
  );
}
