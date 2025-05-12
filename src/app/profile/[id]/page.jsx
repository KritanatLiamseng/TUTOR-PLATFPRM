// src/app/profile/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => alert("❌ โหลดข้อมูลไม่สำเร็จ: " + err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-10">กำลังโหลดข้อมูล...</p>;
  if (!user || user.error) return <p className="text-center py-10 text-red-600">ไม่พบผู้ใช้</p>;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Profile card */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center">
            <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-md border-4 border-white -mt-24">
              {user.profile_image
                ? <Image src={user.profile_image} alt="profile" fill className="object-cover" />
                : <div className="w-full h-full bg-gray-200" />}
            </div>
            <h2 className="text-3xl font-bold mt-4 text-gray-800">
              {user.name} {user.surname}
            </h2>
            <div className="mt-6 w-full space-y-3 text-gray-700">
              <div className="flex">
                <span className="w-32 font-semibold">📧 อีเมล:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">📱 เบอร์โทร:</span>
                <span>{user.phone || "-"}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">🎓 การศึกษา:</span>
                <span>{user.education_level || "-"}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">🔖 บทบาท:</span>
                <span>{user.role}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold">📌 สถานะ:</span>
                <span>{user.status}</span>
              </div>
            </div>

            {user.role === "tutor" && user.bank_name && (
              <div className="mt-6 w-full p-4 bg-gray-50 rounded border">
                <h3 className="text-lg font-semibold mb-2">🏦 ข้อมูลบัญชีธนาคาร</h3>
                <p>ชื่อธนาคาร: {user.bank_name}</p>
                <p>เลขบัญชี: {user.bank_account_number}</p>
                <p>ชื่อบัญชี: {user.bank_account_name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right columns: Courses */}
        <div className="md:col-span-2 space-y-8">
          {user.role === "tutor" && user.courses.length > 0 && (
            <section>
              <h3 className="text-2xl font-semibold mb-4">📚 คอร์สที่สอน</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {user.courses.map((c) => (
                  <div key={c.course_id} className="border p-6 rounded-lg bg-white shadow">
                    <h4 className="font-medium text-lg mb-2">{c.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">วิชา: {c.subject_name}</p>
                    <p className="text-sm text-gray-600 mb-1">ระดับ: {c.level}</p>
                    <p className="text-sm text-gray-600 mb-1">ราคา: {c.rate} บาท/ชม.</p>
                    <p className="text-sm text-gray-600">รูปแบบ: {c.method}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
