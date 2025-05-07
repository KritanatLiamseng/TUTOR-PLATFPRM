"use client";

import { useState, useEffect } from "react";
import { useRouter }         from "next/navigation";
import Header                from "@/app/components/header";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaMoneyBillAlt,
} from "react-icons/fa";

export default function BookingHistoryTutorPage() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const tutorId = localStorage.getItem("userId");
    if (!tutorId) {
      router.push("/login");
      return;
    }

    // โหลดข้อมูลติวเตอร์ สำหรับแสดงใน Header
    fetch(`/api/user/${tutorId}`)
      .then((r) => r.json())
      .then((u) => { if (!u.error) setUser(u); })
      .catch(console.error);

    // โหลดรายการจองจากนักเรียน
    fetch(`/api/bookings?tutor_id=${tutorId}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to load bookings");
        }
        return res.json();
      })
      .then(setBookings)
      .catch((err) => {
        console.error("❌ โหลดจองจากนักเรียนไม่สำเร็จ:", err);
        alert("❌ ไม่สามารถโหลดประวัติการจองได้");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">กำลังโหลดรายการจองจากนักเรียน…</p>
      </div>
    );
  }

  // แก้ไข menuItems ให้ครบถ้วน
  const menuItems = [
    { label: "การจองจากนักเรียน", path: "/booking-historytutor" },
    { label: "โปรไฟล์ของคุณ",      path: "/tutorprofile" },
    { label: "นโยบาย",           path: "/policy" },
    { label: "ศูนย์ช่วยเหลือ",   path: "/support" },
    { label: "รายงาน",           path: "/report" },
    {
      label: "ออกจากระบบ",
      onClick: () => {
        localStorage.removeItem("userId");
        router.push("/login");
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header dropdownItems={menuItems} user={user} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">
          การจองจากนักเรียน
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">
            ยังไม่มีใครจองคอร์สของคุณ
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
              <div
                key={b.booking_id}
                className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between"
              >
                {/* นักเรียน */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={b.student.profile_image || "/default-profile.png"}
                    alt={`${b.student.name} ${b.student.surname}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">
                      {b.student.name} {b.student.surname}
                    </p>
                    <p className="text-sm text-gray-500">
                      วิชา {b.course.subject_name}
                    </p>
                  </div>
                </div>

                {/* คอร์ส + วันเวลา */}
                <div>
                  <p className="text-lg font-medium">{b.course.title}</p>
                  <p className="text-gray-600 mt-1">
                    {new Date(b.booking_date).toLocaleString("th-TH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                {/* สถานะ */}
                <span
                  className={`inline-block mt-4 px-3 py-1 text-sm font-medium rounded-full ${
                    b.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : b.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {b.status === "pending"
                    ? "รอยืนยัน"
                    : b.status === "confirmed"
                    ? "ยืนยันแล้ว"
                    : "ยกเลิกแล้ว"}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
