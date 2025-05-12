"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/app/components/header";

export default function AdminEditUserPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    name: "", surname: "", email: "", phone: "", role: "student",
    bank_name: "", bank_account_number: "", bank_account_name: ""
  });

  // โหลดข้อมูลของนักเรียน
  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name:                data.name            || "",
          surname:             data.surname         || "",
          email:               data.email           || "",
          phone:               data.phone           || "",
          role:                data.role            || "student",
          bank_name:           data.bank_name       || "",
          bank_account_number: data.bank_account_number || "",
          bank_account_name:   data.bank_account_name   || ""
        });
      })
      .catch(err => {
        console.error(err);
        alert("❌ โหลดข้อมูลล้มเหลว");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // บันทึกข้อมูล
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/user/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Save failed");
      alert("✅ บันทึกสำเร็จ");
      router.push("/admin-actions");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">⏳ กำลังโหลด...</p>;

  return (
    <>
      <Header dropdownItems={[]} user={{ name: form.name, username: form.email }} />
      <main className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow mt-6">
        <h1 className="text-2xl font-bold mb-4">แก้ไขข้อมูลนักเรียน</h1>

        {/* ชื่อ */}
        <label className="block text-sm font-medium">ชื่อ</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
        />

        {/* นามสกุล */}
        <label className="block text-sm font-medium">นามสกุล</label>
        <input
          name="surname"
          value={form.surname}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
        />

        {/* อีเมล */}
        <label className="block text-sm font-medium">อีเมล</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
        />

        {/* เบอร์โทร */}
        <label className="block text-sm font-medium">เบอร์โทร</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
        />

        {/* บทบาท */}
        <label className="block text-sm font-medium">บทบาท</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="student">นักเรียน</option>
          <option value="tutor">ติวเตอร์</option>
          <option value="admin">ผู้ดูแล</option>
        </select>

        {/* ช่องบัญชีถ้าเป็นติวเตอร์ */}
        {form.role === "tutor" && (
          <>
            <label className="block text-sm font-medium">ชื่อธนาคาร</label>
            <input
              name="bank_name"
              value={form.bank_name}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
            />
            <label className="block text-sm font-medium">เลขบัญชี</label>
            <input
              name="bank_account_number"
              value={form.bank_account_number}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-3"
            />
            <label className="block text-sm font-medium">ชื่อบัญชี</label>
            <input
              name="bank_account_name"
              value={form.bank_account_name}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-4"
            />
          </>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => {
              if (confirm("ต้องการลบผู้ใช้นี้หรือไม่?"))
                fetch(`/api/user/${id}`, { method: "DELETE" })
                  .then(() => router.push("/admin-actions"));
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            🗑️ ลบ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {saving ? "⏳ กำลังบันทึก..." : "💾 บันทึก"}
          </button>
        </div>
      </main>
    </>
  );
}
