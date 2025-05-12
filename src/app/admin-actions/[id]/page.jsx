// src/app/admin-actions/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminActionsHome() {
  const router = useRouter();
  const [students, setStudents]     = useState([]);
  const [tutors, setTutors]         = useState([]);
  const [loadingUsers, setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/user?role=student").then(r => r.json()),
      fetch("/api/user?role=tutor").then(r => r.json()),
    ])
      .then(([s, t]) => {
        setStudents(s || []);
        setTutors(t || []);
      })
      .catch((e) => {
        console.error(e);
        alert("❌ โหลดข้อมูลผู้ใช้ล้มเหลว: " + e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderCard = (u, isTutor = false) => (
    <div
      key={u.user_id}
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {u.profile_image
            ? <Image src={u.profile_image} alt="" width={48} height={48} className="object-cover"/>
            : <div className="w-full h-full bg-gray-200" />}
        </div>
        <div>
          <h3 className="font-medium text-lg">{u.name} {u.surname}</h3>
          {isTutor && u.tutor?.bank_name && (
            <p className="text-sm text-gray-500">
              🏦 {u.tutor.bank_name}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto flex flex-wrap gap-2">
        <button
          onClick={() => router.push(`/profile/${u.user_id}`)}
          className="flex-1 px-3 py-1 text-sm text-gray-700 border rounded hover:bg-gray-100"
        >
          👁️ ดูโปรไฟล์
        </button>
        <button
          onClick={() => router.push(`/admin-actions/${u.user_id}`)}
          className="flex-1 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
        >
          ✏️ แก้ไข
        </button>
        <button
          onClick={async () => {
            if (!confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) return;
            await fetch(`/api/user/${u.user_id}`, { method: "DELETE" });
            isTutor
              ? setTutors(ts => ts.filter(x => x.user_id !== u.user_id))
              : setStudents(ss => ss.filter(x => x.user_id !== u.user_id));
          }}
          className="flex-1 px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
        >
          🗑️ ลบ
        </button>
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">แดชบอร์ดผู้ดูแลระบบ</h1>

      <section className="mb-12">
        <button
          onClick={() => router.push("/admin-actions/bookings/all")}
          className="inline-block mb-4 text-blue-600 hover:underline"
        >
          📑 ดูรายการจองทั้งหมด
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingUsers
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white h-32 rounded-lg"
                />
              ))
            : students.map(u => renderCard(u, false))
          }
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">👩‍🏫 ติวเตอร์</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingUsers
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white h-32 rounded-lg"
                />
              ))
            : tutors.map(u => renderCard(u, true))
          }
        </div>
      </section>
    </main>
  );
}
