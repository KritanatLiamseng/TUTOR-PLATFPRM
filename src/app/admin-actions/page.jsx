"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminActionsHome() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/user?role=student").then((res) => res.json()),
      fetch("/api/user?role=tutor").then((res) => res.json()),
    ])
      .then(([s, t]) => {
        setStudents(s || []);
        setTutors(t || []);
      })
      .catch((err) => alert("❌ โหลดข้อมูลล้มเหลว: " + err.message));
  }, []);

  const handleEdit = (id) => router.push(`/admin-actions/${id}`);
  const handleDelete = async (id) => {
    if (!confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) return;
    try {
      const res = await fetch(`/api/user/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");
      setStudents((s) => s.filter((u) => u.user_id !== id));
      setTutors((t) => t.filter((u) => u.user_id !== id));
      alert("✅ ลบสำเร็จ");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleView = (id) => router.push(`/profile/${id}`);

  const renderUserCard = (user) => (
    <div
      key={user.user_id}
      className="flex items-center justify-between px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 relative rounded-full overflow-hidden">
          {user.profile_image ? (
            <Image
              src={user.profile_image}
              alt="avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
          )}
        </div>
        <span>{user.name} {user.surname}</span>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => handleView(user.user_id)}
          className="px-2 py-1 text-sm text-gray-700 border border-gray-400 rounded hover:bg-gray-100"
        >
          👁️ ดูโปรไฟล์
        </button>
        <button
          onClick={() => handleEdit(user.user_id)}
          className="px-2 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
        >
          ✏️ แก้ไข
        </button>
        <button
          onClick={() => handleDelete(user.user_id)}
          className="px-2 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
        >
          🗑️ ลบ
        </button>
      </div>
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">แดชบอร์ดผู้ดูแลระบบ</h1>

      <ul className="space-y-4 mb-10">
        <li className="border p-4 rounded-lg bg-white shadow hover:bg-gray-50">
          <button
            onClick={() => router.push("/admin-actions/bookings")}
            className="text-blue-600 hover:underline"
          >
            📦 รายการจองที่รอการโอนเงิน
          </button>
        </li>
        <li className="border p-4 rounded-lg bg-white shadow hover:bg-gray-50">
          <button
            onClick={() => router.push("/admin-actions/11")}
            className="text-blue-600 hover:underline"
          >
            👤 ดูข้อมูลผู้ใช้ ID 11
          </button>
        </li>
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">👨‍🎓 นักเรียน</h2>
          <div className="space-y-2">
            {students.map(renderUserCard)}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">👩‍🏫 ติวเตอร์</h2>
          <div className="space-y-2">
            {tutors.map(renderUserCard)}
          </div>
        </div>
      </div>
    </main>
  );
}
