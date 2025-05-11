// src/app/admin-actions/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminActionsHome() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch users
  useEffect(() => {
    setLoadingUsers(true);
    Promise.all([
      fetch("/api/user?role=student").then((r) => r.json()),
      fetch("/api/user?role=tutor").then((r) => r.json()),
    ])
      .then(([s, t]) => {
        setStudents(s || []);
        setTutors(t || []);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ โหลดข้อมูลผู้ใช้ล้มเหลว: " + err.message);
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">แดชบอร์ดผู้ดูแลระบบ</h1>

      <ul className="space-y-4 mb-10">
        {/* เอา <li> แรกออกไปแล้ว */}
        <li className="border p-4 rounded-lg bg-white shadow hover:bg-gray-50">
          <button
            onClick={() => router.push("/admin-actions/bookings/all")}
            className="text-blue-600 hover:underline"
          >
            📑 ดูรายการจองทั้งหมด
          </button>
          <p className="mt-1 text-sm text-gray-500">
            เช็คว่านักเรียนคนไหนจองเรียนกับติวเตอร์คนไหน วันไหน วิชาอะไร เวลาไหน
          </p>
        </li>
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* - ฝั่งนักเรียน */}
        <div>
          <h2 className="text-xl font-semibold mb-4">👨‍🎓 นักเรียน</h2>
          <div className="space-y-2">
            {loadingUsers
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center justify-between px-4 py-2 bg-white border rounded shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                      <div className="h-4 bg-gray-300 rounded w-24" />
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-4 bg-gray-300 rounded" />
                      <div className="w-8 h-4 bg-gray-300 rounded" />
                      <div className="w-8 h-4 bg-gray-300 rounded" />
                    </div>
                  </div>
                ))
              : students.map((user) => (
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
                      <span>
                        {user.name} {user.surname}
                      </span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => router.push(`/profile/${user.user_id}`)}
                        className="px-2 py-1 text-sm text-gray-700 border border-gray-400 rounded hover:bg-gray-100"
                      >
                        👁️ ดูโปรไฟล์
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/admin-actions/${user.user_id}`)
                        }
                        className="px-2 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                      >
                        ✏️ แก้ไข
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) {
                            await fetch(`/api/user/${user.user_id}`, {
                              method: "DELETE",
                            });
                            setStudents((s) =>
                              s.filter((u) => u.user_id !== user.user_id)
                            );
                          }
                        }}
                        className="px-2 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                      >
                        🗑️ ลบ
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* - ฝั่งติวเตอร์ */}
        <div>
          <h2 className="text-xl font-semibold mb-4">👩‍🏫 ติวเตอร์</h2>
          <div className="space-y-2">
            {loadingUsers
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center justify-between px-4 py-2 bg-white border rounded shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                      <div className="h-4 bg-gray-300 rounded w-24" />
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-4 bg-gray-300 rounded" />
                      <div className="w-8 h-4 bg-gray-300 rounded" />
                      <div className="w-8 h-4 bg-gray-300 rounded" />
                    </div>
                  </div>
                ))
              : tutors.map((user) => (
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
                      <span>
                        {user.name} {user.surname}
                      </span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/profile/${user.user_id}`)
                        }
                        className="px-2 py-1 text-sm text-gray-700 border border-gray-400 rounded hover:bg-gray-100"
                      >
                        👁️ ดูโปรไฟล์
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/admin-actions/${user.user_id}`)
                        }
                        className="px-2 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                      >
                        ✏️ แก้ไข
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) {
                            await fetch(`/api/user/${user.user_id}`, {
                              method: "DELETE",
                            });
                            setTutors((t) =>
                              t.filter((u) => u.user_id !== user.user_id)
                            );
                          }
                        }}
                        className="px-2 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                      >
                        🗑️ ลบ
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </main>
  );
}
