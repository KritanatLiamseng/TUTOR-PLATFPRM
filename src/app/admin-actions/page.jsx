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
  const [activeTab, setActiveTab]   = useState("students"); // "students" or "tutors"

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
      .catch(err => {
        console.error(err);
        alert("❌ โหลดข้อมูลผู้ใช้ล้มเหลว: " + err.message);
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
            <p className="text-sm text-gray-500">🏦 {u.tutor.bank_name}</p>
          )}
        </div>
      </div>
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

  const currentList = activeTab === "students" ? students : tutors;
  const isTutorTab  = activeTab === "tutors";

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">แดชบอร์ดผู้ดูแลระบบ</h1>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "students"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          👨‍🎓 นักเรียน ({students.length})
        </button>
        <button
          onClick={() => setActiveTab("tutors")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "tutors"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          👩‍🏫 ติวเตอร์ ({tutors.length})
        </button>
        <button
          onClick={() => router.push("/admin-actions/bookings/all")}
          className="ml-auto px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          📑 ดูรายการจองทั้งหมด
        </button>
      </div>

      {loadingUsers ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map(u => renderCard(u, isTutorTab))}
        </div>
      )}
    </main>
  );
}
