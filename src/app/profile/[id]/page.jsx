"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => alert("❌ โหลดข้อมูลไม่สำเร็จ: " + err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center">กำลังโหลดข้อมูล...</p>;
  if (!user || user.error) return <p className="text-center text-red-600">ไม่พบผู้ใช้</p>;

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-white -mt-20">
          {user.profile_image ? (
            <Image
              src={user.profile_image}
              alt="profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        <h2 className="text-2xl font-bold mt-4 text-gray-800">
          {user.name} {user.surname}
        </h2>

        <div className="mt-6 w-full space-y-3 text-gray-700">
          <div className="flex items-center">
            <span className="w-32 font-semibold">📧 อีเมล:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-semibold">📱 เบอร์โทร:</span>
            <span>{user.phone || "-"}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-semibold">🧑‍🎓 การศึกษา:</span>
            <span>{user.education_level || "-"}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-semibold">🔖 บทบาท:</span>
            <span>{user.role}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-semibold">📌 สถานะบัญชี:</span>
            <span>{user.status}</span>
          </div>
        </div>

        {user.role === "tutor" && user.courses?.length > 0 && (
          <div className="mt-10 w-full">
            <h3 className="text-xl font-semibold mb-3">📚 คอร์สที่สอน</h3>
            <ul className="space-y-2">
              {user.courses.map((c) => (
                <li key={c.course_id} className="border p-3 rounded-lg bg-gray-50">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-gray-600">วิชา: {c.subject_name}</p>
                  <p className="text-sm text-gray-600">ระดับ: {c.level}</p>
                  <p className="text-sm text-gray-600">ราคา: {c.rate} บาท/ชม.</p>
                  <p className="text-sm text-gray-600">รูปแบบ: {c.method}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
