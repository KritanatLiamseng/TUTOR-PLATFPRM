"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditCoursePage() {
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
  const { course_id } = useParams();
  const router = useRouter();

  // โหลดข้อมูลวิชาและข้อมูลคอร์สเดิม
  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then(setSubjects);

    fetch(`/api/tutor/courses/${course_id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          subject_id: data.subject_id,
          course_title: data.course_title,
          course_description: data.course_description,
          rate_per_hour: data.rate_per_hour,
          teaching_method: data.teaching_method,
          level: data.level,
        });
      });
  }, [course_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/tutor/courses/${course_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/hometutor");
    } else {
      const err = await res.json();
      alert("❌ แก้ไขคอร์สล้มเหลว: " + err.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-6">✏️ แก้ไขคอร์ส</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">ชื่อวิชา</label>
          <select
            name="subject_id"
            value={form.subject_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            {subjects.map((subject) => (
              <option key={subject.subject_id} value={subject.subject_id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">ชื่อคอร์ส</label>
          <input
            type="text"
            name="course_title"
            value={form.course_title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">รายละเอียด</label>
          <textarea
            name="course_description"
            value={form.course_description}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">ระดับชั้น</label>
            <input
              type="text"
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">ราคา/ชม</label>
            <input
              type="number"
              name="rate_per_hour"
              value={form.rate_per_hour}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">รูปแบบการสอน</label>
          <input
            type="text"
            name="teaching_method"
            value={form.teaching_method}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "⏳ กำลังอัปเดต..." : "✅ บันทึกการแก้ไข"}
        </button>
      </form>
    </div>
  );
}
