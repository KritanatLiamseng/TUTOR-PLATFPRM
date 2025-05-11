// src/app/admin-actions/[id]/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/app/components/header";

export default function AdminEditUserPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    role: "student",
  });

  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone || "",
          role: data.role,
        });
      })
      .catch((err) => alert("❌ " + err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }
      alert("✅ บันทึกสำเร็จ");
      router.push("/admin-actions");
    } catch (e) {
      alert("❌ " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) return;
    try {
      const res = await fetch(`/api/user/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      alert("✅ ลบผู้ใช้เรียบร้อย");
      router.push("/admin-actions");
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  if (loading) return <p className="p-6">⏳ กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pass the loaded user object into Header */}
      <Header dropdownItems={[]} user={user} />

      <main className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">แก้ไขข้อมูลผู้ใช้</h1>

        <div className="space-y-4">
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
            <label className="block text-sm font-medium">อีเมล</label>
            <input
              name="email"
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
          <div>
            <label className="block text-sm font-medium">บทบาท</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="student">นักเรียน</option>
              <option value="tutor">ติวเตอร์</option>
              <option value="admin">ผู้ดูแล</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ ลบผู้ใช้
          </button>
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
