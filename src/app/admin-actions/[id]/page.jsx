"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setUser(data);
      })
      .catch((err) => alert("❌ " + err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4">⏳ กำลังโหลดข้อมูลผู้ใช้…</p>;
  if (!user) return <p className="p-4 text-red-600">❌ ไม่พบผู้ใช้</p>;

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">รายละเอียดผู้ใช้</h1>
      <ul className="space-y-2">
        <li><strong>ชื่อ:</strong> {user.name}</li>
        <li><strong>นามสกุล:</strong> {user.surname}</li>
        <li><strong>อีเมล:</strong> {user.email}</li>
        <li><strong>เบอร์โทร:</strong> {user.phone}</li>
        <li><strong>บทบาท:</strong> {user.role === "tutor" ? "ติวเตอร์" : "นักเรียน"}</li>
      </ul>
    </main>
  );
}
