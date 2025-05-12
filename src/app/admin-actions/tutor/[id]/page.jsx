// File: src/app/admin-actions/tutor/[id]/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function AdminEditTutorPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    experience_years: "",
    rate_per_hour: "",
    available_time: "",
    education_level: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const profileRef = useRef(null);
  const docsRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/tutor/${id}`);
        if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
        const data = await res.json();
        setForm({
          name: data.name || "",
          surname: data.surname || "",
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          experience_years: data.experience_years?.toString() || "",
          rate_per_hour: data.rate_per_hour?.toString() || "",
          available_time: data.available_time || "",
          education_level: data.education_background || "",
          bank_name: data.bank_name || "",
          bank_account_number: data.bank_account_number || "",
          bank_account_name: data.bank_account_name || "",
        });
      } catch (e) {
        alert("❌ " + e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      for (let [k, v] of Object.entries(form)) {
        fd.append(k, v);
      }
      if (profileRef.current?.files[0]) {
        fd.append("profile_image", profileRef.current.files[0]);
      }
      if (docsRef.current?.files.length) {
        Array.from(docsRef.current.files).forEach((file) =>
          fd.append("verification_documents", file)
        );
      }
      const res = await fetch(`/api/tutor/${id}`, { method: "PUT", body: fd });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "อัปเดตไม่สำเร็จ");
      }
      alert("✅ อัปเดตสำเร็จ");
      router.push("/admin-actions");
    } catch (e) {
      alert("❌ " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">⏳ กำลังโหลดข้อมูลติวเตอร์...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">แก้ไขข้อมูลติวเตอร์</h1>

        <div className="space-y-4">
          {/* ชื่อ นามสกุล ชื่อผู้ใช้ อีเมล เบอร์โทร */}
          <div>
            <label className="block text-sm font-medium">ชื่อ</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">นามสกุล</label>
            <input
              name="surname"
              value={form.surname}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ชื่อผู้ใช้</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">อีเมล</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">เบอร์โทร</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* ข้อมูลติวเตอร์ */}
          <div>
            <label className="block text-sm font-medium">ประวัติสั้น (bio)</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ประสบการณ์ (ปี)</label>
            <input
              name="experience_years"
              type="number"
              value={form.experience_years}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">เรทราคา (บาท/ชม.)</label>
            <input
              name="rate_per_hour"
              type="number"
              value={form.rate_per_hour}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">เวลาที่ว่าง</label>
            <input
              name="available_time"
              value={form.available_time}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ระดับการศึกษา</label>
            <input
              name="education_level"
              value={form.education_level}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* บัญชีธนาคาร */}
          <div>
            <label className="block text-sm font-medium">ชื่อธนาคาร</label>
            <input
              name="bank_name"
              value={form.bank_name}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">เลขบัญชี</label>
            <input
              name="bank_account_number"
              value={form.bank_account_number}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ชื่อบัญชี</label>
            <input
              name="bank_account_name"
              value={form.bank_account_name}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* อัปโหลดไฟล์ */}
          <div>
            <label className="block text-sm font-medium">รูปโปรไฟล์</label>
            <input type="file" ref={profileRef} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">เอกสารยืนยัน</label>
            <input type="file" multiple ref={docsRef} className="mt-1" />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </main>
    </div>
  );
}