// src/app/admin-actions/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function AdminActionsHome() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/user?role=student").then(r => r.json()),
      fetch("/api/user?role=tutor").then(r => r.json()),
    ])
      .then(([s, t]) => {
        setStudents(Array.isArray(s) ? s : []);
        setTutors(Array.isArray(t) ? t : []);
      })
      .catch(err => {
        console.error(err);
        alert("❌ โหลดข้อมูลล้มเหลว");
      })
      .finally(() => setLoading(false));
  }, []);

  const Card = ({ user, isTutor }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100">
          {user.profile_image
            ? <Image src={user.profile_image} alt="" width={56} height={56} className="object-cover" />
            : <div className="w-full h-full bg-gray-200" />}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-semibold">{user.name} {user.surname}</h3>
          {isTutor && user.tutor?.bank_name && (
            <p className="text-sm text-gray-500">🏦 {user.tutor.bank_name}</p>
          )}
        </div>
      </div>
      <div className="mt-auto flex justify-between space-x-2">
        <button
          onClick={() => router.push(`/profile/${user.user_id}`)}
          className="flex-1 flex items-center justify-center gap-2 px-2 py-1 text-sm text-gray-700 border rounded hover:bg-gray-100"
        >
          <FaEye /> ดู
        </button>
        <button
          onClick={() =>
            router.push(isTutor
              ? `/admin-actions/tutor/${user.user_id}`
              : `/admin-actions/user/${user.user_id}`
            )
          }
          className="flex-1 flex items-center justify-center gap-2 px-2 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
        >
          <FaEdit /> แก้ไข
        </button>
        <button
          onClick={async () => {
            if (!confirm("ลบผู้ใช้หรือไม่?")) return;
            await fetch(`/api/user/${user.user_id}`, { method: "DELETE" });
            isTutor
              ? setTutors(ts => ts.filter(x => x.user_id !== user.user_id))
              : setStudents(ss => ss.filter(x => x.user_id !== user.user_id));
          }}
          className="flex-1 flex items-center justify-center gap-2 px-2 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
        >
          <FaTrash /> ลบ
        </button>
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <h1 className="text-4xl font-bold text-center">แดชบอร์ดผู้ดูแลระบบ</h1>

      <div className="text-right">
        <button
          onClick={() => router.push("/admin-actions/bookings/all")}
          className="inline-block text-blue-600 hover:underline"
        >
          📑 ดูรายการจองทั้งหมด
        </button>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">👨‍🎓 นักเรียน</h2>
        {loading
          ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-48 bg-white rounded-xl shadow"
                />
              ))}
            </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map(u => <Card key={u.user_id} user={u} isTutor={false} />)}
            </div>
        }
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">👩‍🏫 ติวเตอร์</h2>
        {loading
          ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-48 bg-white rounded-xl shadow"
                />
              ))}
            </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map(u => <Card key={u.user_id} user={u} isTutor={true} />)}
            </div>
        }
      </section>
    </main>
  );
}
