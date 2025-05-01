/* src/app/studentprofile/edit/page.jsx */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaUpload, FaUser, FaPhone, FaEnvelope, FaIdCard, FaLock } from "react-icons/fa";
import Header from "@/app/components/header";

export default function EditStudentProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    profile_image: null,
    previewUrl: "",
    name: "",
    phone: "",
    email: "",
    username: "",
    password: ""
  });

  const menuItems = [
    { label: "ประวัติการจอง", path: "/booking-history" },
    { label: "บัญชีของฉัน", path: "/studentprofile" },
    { label: "นโยบาย", path: "/policy" },
    { label: "ศูนย์ช่วยเหลือ", path: "/support" },
    { label: "รายงาน", path: "/report" },
    { label: "ออกจากระบบ", onClick: () => { localStorage.removeItem("userId"); router.push("/login"); } }
  ];

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/user/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          previewUrl: data.profile_image || "/default-profile.png",
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          username: data.username || "",
          password: ""
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "profile_image" && files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setForm(prev => ({ ...prev, profile_image: file, previewUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const payload = {
      profile_image: form.previewUrl,
      name: form.name,
      phone: form.phone,
      email: form.email,
      username: form.username,
      password: form.password || undefined,
    };

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) router.push("/studentprofile");
      else {
        const err = await res.json();
        alert(`❌ ${err.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header flush to top */}
      <Header dropdownItems={menuItems} />

      {/* Page content with padding */}
      <div className="max-w-2xl mx-auto mt-4 px-4">
        <button onClick={() => router.push("/studentprofile")} className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2">
          <FaArrowLeft /> ย้อนกลับ
        </button>

        <div className="bg-white p-6 shadow-lg rounded-xl">
          <h1 className="text-xl font-bold mb-4">✏️ แก้ไขโปรไฟล์นักศึกษา</h1>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-600">รูปโปรไฟล์</label>
            <div className="flex items-center gap-4">
              <img src={form.previewUrl || "/default-profile.png"} alt="preview" className="w-20 h-20 rounded-full object-cover border" />
              <input type="file" name="profile_image" accept="image/*" onChange={handleChange} className="text-sm" />
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <FormInput label="ชื่อ" name="name" value={form.name} onChange={handleChange} />
            <FormInput label="เบอร์โทร" name="phone" value={form.phone} onChange={handleChange} />
            <FormInput label="อีเมล" name="email" type="email" value={form.email} onChange={handleChange} />
            <FormInput label="ชื่อผู้ใช้" name="username" value={form.username} onChange={handleChange} />
            <FormInput label="รหัสผ่านใหม่" name="password" type="password" value={form.password} onChange={handleChange} />
            <button disabled={loading} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
              {loading ? "⌛ กำลังบันทึก..." : "💾 บันทึกข้อมูล"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
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
