// src/app/admin-actions/tutor/[id]/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Header from "@/app/components/header";

export default function AdminEditTutorPage({ params }) {
  const { id } = params;
  const router   = useRouter();
  const [form, setForm]       = useState({
    name: "", phone: "", email: "", username: "",
    bio: "", experience_years: "", rate_per_hour: "",
    available_time: "", education_level: "",
    bank_name: "", bank_account_number: "", bank_account_name: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const profileRef = useRef(null);
  const docsRef    = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`/api/tutor/${id}`);
        if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
        const data = await res.json();
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          username: data.username || "",
          bio: data.bio || "",
          experience_years: data.experience_years?.toString() || "",
          rate_per_hour:    data.rate_per_hour?.toString()    || "",
          available_time:   data.available_time || "",
          education_level:  data.education_background || "",
          bank_name:        data.bank_name || "",
          bank_account_number: data.bank_account_number || "",
          bank_account_name:   data.bank_account_name || "",
        });
      } catch (e) {
        alert("❌ " + e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      for (let [k, v] of Object.entries(form)) {
        if (v !== undefined) fd.append(k, v);
      }
      if (profileRef.current?.files[0]) {
        fd.append("profile_image", profileRef.current.files[0]);
      }
      if (docsRef.current?.files.length) {
        Array.from(docsRef.current.files)
          .forEach(file => fd.append("verification_documents", file));
      }
      const res = await fetch(`/api/tutor/${id}`, {
        method: "PUT",
        body:   fd,
      });
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
      <Header dropdownItems={[]} user={{ name: form.name, username: form.username }} />
      <main className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">แก้ไขข้อมูลติวเตอร์</h1>
        <div className="space-y-4">
          {/* ฟอร์มตั้งแต่ชื่อ–username, bio, experience, rate, available_time, education_level */}
          {/* ... */}
          {/* ส่วนบัญชีธนาคาร */}
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
          {/* อัปโหลดรูปโปรไฟล์ และเอกสาร */}
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
