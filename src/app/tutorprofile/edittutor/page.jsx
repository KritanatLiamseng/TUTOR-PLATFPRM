"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const EditTutorProfilePage = () => {
  const router = useRouter();
  const [tutorData, setTutorData] = useState({
    education_level: "",
    experience_years: "",
    available_time: "",
    rate_per_hour: "",
    subject_details: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((user) => {
          setTutorData((prev) => ({
            ...prev,
            education_level: user.education_level || "",
          }));
          return fetch(`/api/tutor/${userId}`);
        })
        .then((res) => res.json())
        .then((tutor) => {
          setTutorData((prev) => ({
            ...prev,
            experience_years: tutor.experience_years || "",
            available_time: tutor.available_time || "",
            rate_per_hour: tutor.rate_per_hour || "",
            subject_details: tutor.subject_details || "",
          }));
          setLoading(false);
        })
        .catch((err) => {
          console.error("โหลดข้อมูลผิดพลาด:", err);
          setLoading(false);
        });
    }
  }, []);

  const handleChange = (key, value) => {
    setTutorData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    const res = await fetch(`/api/tutor/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tutorData),
    });

    if (res.ok) {
      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      router.push("/tutorprofile");
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleBack = () => router.back();

  if (loading) {
    return <p className="text-center mt-10">กำลังโหลดข้อมูล...</p>;
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <button
          onClick={handleBack}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft /> ย้อนกลับ
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-700">แก้ไขโปรไฟล์ติวเตอร์</h2>

        {/* ฟอร์มกรอก */}
        <div className="space-y-4">
          <Input label="วุฒิการศึกษา" value={tutorData.education_level} onChange={(val) => handleChange("education_level", val)} />
          <Input label="ประสบการณ์ (ปี)" value={tutorData.experience_years} onChange={(val) => handleChange("experience_years", val)} />
          <Input label="ตารางสอน" value={tutorData.available_time} onChange={(val) => handleChange("available_time", val)} />
          <Input label="อัตราค่าบริการ (บาท/ชม.)" value={tutorData.rate_per_hour} onChange={(val) => handleChange("rate_per_hour", val)} />
          <Textarea label="รายละเอียดวิชาที่สอน" value={tutorData.subject_details} onChange={(val) => handleChange("subject_details", val)} />
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold"
        >
          💾 บันทึกข้อมูล
        </button>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <textarea
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default EditTutorProfilePage;
