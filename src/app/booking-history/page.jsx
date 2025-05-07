// File: src/app/booking-history/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaMoneyBillAlt,
} from "react-icons/fa";

export default function BookingHistoryPage() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [canceling, setCanceling] = useState(null);

  const menuItems = [
    { label: "ประวัติการจอง", path: "/booking-history" },
    { label: "บัญชีของฉัน",   path: "/studentprofile" },
    { label: "นโยบาย",       path: "/policy" },
    { label: "ศูนย์ช่วยเหลือ", path: "/support" },
    { label: "รายงาน",       path: "/report" },
    {
      label: "ออกจากระบบ",
      onClick: () => {
        localStorage.removeItem("userId");
        router.push("/login");
      },
    },
  ];

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return router.push("/login");

    Promise.all([
      fetch(`/api/user/${uid}`).then((r) => r.json()),
      fetch(`/api/bookings?student_id=${uid}`).then((r) => r.json()),
    ])
      .then(([u, b]) => {
        if (u.error) throw new Error(u.error);
        if (b.error) throw new Error(b.error);
        setUser(u);
        setBookings(b);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ " + err.message);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleCancel = async (bookingId) => {
    if (!confirm("ยืนยันการยกเลิกการจองนี้?")) return;
    setCanceling(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      // อัปเดตสถานะในหน้าเลย
      setBookings((bs) =>
        bs.map((b) =>
          b.booking_id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      alert("❌ ยกเลิกไม่สำเร็จ: " + err.message);
    } finally {
      setCanceling(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">กำลังโหลดประวัติการจอง…</p>
      </div>
    );
  }

  // แยก booking ตามสถานะ
  const activeBookings    = bookings.filter((b) => b.status !== "cancelled");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header dropdownItems={menuItems} user={user} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">ประวัติการจอง</h1>

        {/* --- ส่วนการจองปัจจุบัน --- */}
        {activeBookings.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">การจองปัจจุบัน</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              {activeBookings.map((b) => (
                <BookingCard
                  key={b.booking_id}
                  booking={b}
                  onCancel={handleCancel}
                  canceling={canceling === b.booking_id}
                  isCancelled={false}
                />
              ))}
            </div>
          </>
        )}

        {/* --- ส่วนการจองที่ยกเลิกแล้ว --- */}
        {cancelledBookings.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-red-600">
              การจองที่ยกเลิกแล้ว
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cancelledBookings.map((b) => (
                <BookingCard
                  key={b.booking_id}
                  booking={b}
                  isCancelled={true}
                />
              ))}
            </div>
          </>
        )}

        {/* --- ไม่มี booking เลย --- */}
        {bookings.length === 0 && (
          <div className="text-center text-gray-500">
            คุณยังไม่มีการจองใดๆ
          </div>
        )}
      </main>
    </div>
  );
}

// คอมโพเนนต์ย่อย
function BookingCard({ booking, onCancel, canceling, isCancelled }) {
  const {
    booking_id,
    course_title,
    subject_name,
    tutor_name,
    booking_date,
    total_amount,
  } = booking;

  const formattedDate = new Date(booking_date).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">{course_title}</h3>
        <p className="text-gray-600">{subject_name}</p>

        <div className="flex items-center text-gray-700 space-x-2">
          <FaChalkboardTeacher className="text-blue-600" />
          <span>{tutor_name}</span>
        </div>

        <div className="flex items-center text-gray-700 space-x-2">
          <FaCalendarAlt className="text-green-600" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center text-gray-700 space-x-2">
          <FaMoneyBillAlt className="text-yellow-600" />
          <span>{total_amount} ฿</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        {isCancelled ? (
          <span className="px-4 py-1 bg-red-100 text-red-800 rounded-full font-medium">
            ยกเลิกแล้ว
          </span>
        ) : (
          <>
            <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
              รอยืนยัน
            </span>
            <button
              onClick={() => onCancel(booking_id)}
              disabled={canceling}
              className="px-4 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 disabled:opacity-50"
            >
              {canceling ? "กำลังยกเลิก…" : "ยกเลิก"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
