"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function EditTutorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    education_level: "",
    experience_years: "",
    available_time: "",
    rate_per_hour: "",
    bio: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(user => {
        setForm({
          education_level: user.education_level || "",
          experience_years: user.experience_years || "",
          available_time: user.available_time || "",
          rate_per_hour: user.rate_per_hour || "",
          bio: user.bio || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("โหลดข้อมูลล้มเหลว:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");

    const res = await fetch(`/api/tutor/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("✅ บันทึกเรียบร้อยแล้ว");
      router.push("/hometutor");
    } else {
      alert("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  if (loading) return <p className="text-center mt-10">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-xl">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="inline mr-1" /> ย้อนกลับ
        </button>

        <h1 className="text-xl font-bold mb-6">📝 แก้ไขโปรไฟล์ติวเตอร์</h1>

        <FormInput label="วุฒิการศึกษา" value={form.education_level} onChange={val => handleChange("education_level", val)} />
        <FormInput label="ประสบการณ์ (ปี)" value={form.experience_years} onChange={val => handleChange("experience_years", val)} />
        <FormInput label="ตารางสอน" value={form.available_time} onChange={val => handleChange("available_time", val)} />
        

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          💾 บันทึกข้อมูล
        </button>
      </div>
    </div>
  );
}

const FormInput = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-600">{label}</label>
    <input
      className="w-full border border-gray-300 rounded px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const FormTextarea = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-600">{label}</label>
    <textarea
      className="w-full border border-gray-300 rounded px-3 py-2"
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
