"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function EditTutorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    profile_image: null,
    previewUrl: "",
    verification_documents: null,
    name: "",
    phone: "",
    email: "",
    username: "",
    education_level: "",
    experience_years: "",
    available_time: "",
    rate_per_hour: "",
    bio: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`/api/tutor/${userId}`)
      .then((res) => res.json())
      .then((user) => {
        setForm((f) => ({
          ...f,
          previewUrl: user.profile_image || "/default-profile.png",
          name: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
          username: user.username || "",
          education_level: user.education_background || "",
          experience_years: user.experience_years || "",
          available_time: user.available_time || "",
          rate_per_hour: user.rate_per_hour || "",
          bio: user.bio || "",
        }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("โหลดข้อมูลล้มเหลว:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image" && files.length > 0) {
      const file = files[0];
      setForm((f) => ({
        ...f,
        profile_image: file,
        previewUrl: URL.createObjectURL(file),
      }));
    } else if (name === "verification_documents" && files.length > 0) {
      const file = files[0];
      setForm((f) => ({ ...f, verification_documents: file }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem("userId");

    const payload = new FormData();
    if (form.profile_image) {
      payload.append("profile_image", form.profile_image);
    }
    if (form.verification_documents) {
      payload.append("verification_documents", form.verification_documents);
    }

    payload.append("name", form.name);
    payload.append("phone", form.phone);
    payload.append("email", form.email);
    payload.append("username", form.username);
    payload.append("education_level", form.education_level);
    payload.append("experience_years", form.experience_years);
    payload.append("available_time", form.available_time);
    payload.append("rate_per_hour", form.rate_per_hour);
    payload.append("bio", form.bio);

    const res = await fetch(`/api/tutor/${userId}`, {
      method: "PUT",
      body: payload,
    });

    if (res.ok) {
      alert("✅ บันทึกเรียบร้อยแล้ว");
      router.push("/hometutor");
    } else {
      const err = await res.json();
      alert("❌ เกิดข้อผิดพลาด: " + err.error);
    }

    setLoading(false);
  };

  if (loading) return <p className="text-center mt-10">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-xl">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          <FaArrowLeft /> ย้อนกลับ
        </button>

        <h1 className="text-xl font-bold mb-6">📝 แก้ไขโปรไฟล์ติวเตอร์</h1>

        {/* รูปโปรไฟล์ */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-600">รูปโปรไฟล์</label>
          <div className="flex items-center gap-4">
            <img
              src={form.previewUrl}
              alt="preview"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleChange}
              className="text-sm"
            />
          </div>
        </div>

        {/* เอกสารยืนยันตัวตน */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-600">
            เอกสารยืนยันตัวตน (เช่น PDF หรือรูปบัตร)
          </label>
          <input
            type="file"
            name="verification_documents"
            accept="image/*,.pdf"
            onChange={handleChange}
            className="text-sm"
          />
        </div>

        {/* ข้อมูลผู้ใช้ */}
        <FormInput label="ชื่อ" name="name" value={form.name} onChange={handleChange} />
        <FormInput label="เบอร์โทร" name="phone" value={form.phone} onChange={handleChange} />
        <FormInput label="อีเมล" name="email" value={form.email} onChange={handleChange} />
        <FormInput label="ชื่อผู้ใช้" name="username" value={form.username} onChange={handleChange} />

        {/* ข้อมูลติวเตอร์ */}
        <FormInput
          label="วุฒิการศึกษา"
          name="education_level"
          value={form.education_level}
          onChange={handleChange}
        />
        <FormInput
          label="ประสบการณ์ (ปี)"
          name="experience_years"
          type="number"
          value={form.experience_years}
          onChange={handleChange}
        />
        <FormInput
          label="ตารางสอน"
          name="available_time"
          value={form.available_time}
          onChange={handleChange}
        />
        <FormInput
          label="ค่าบริการ (บาท/ชม)"
          name="rate_per_hour"
          type="number"
          value={form.rate_per_hour}
          onChange={handleChange}
        />
        <FormTextarea label="Bio" name="bio" value={form.bio} onChange={handleChange} />

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? "⌛ กำลังบันทึก..." : "💾 บันทึกข้อมูล"}
        </button>
      </div>
    </div>
  );
}

function FormInput({ label, name, type = "text", value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-600">{label}</label>
      <input
        name={name}
        type={type}
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function FormTextarea({ label, name, rows = 4, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-600">{label}</label>
      <textarea
        name={name}
        rows={rows}
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
