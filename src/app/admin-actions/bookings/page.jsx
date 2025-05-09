"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminBookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState(null);

  useEffect(() => {
    fetch("/api/admin-actions/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setBookings(data);
      })
      .catch((err) => alert("❌ " + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSettle = async (booking_id) => {
    setSettling(booking_id);
    try {
      const res = await fetch(`/api/admin-actions/bookings/${booking_id}/settle`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("อัปเดตไม่สำเร็จ");
      const data = await res.json();
      setBookings((b) => b.filter((bk) => bk.booking_id !== booking_id));
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setSettling(null);
    }
  };

  if (loading) return <p className="p-4">⏳ กำลังโหลดข้อมูล…</p>;

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">การจองที่รอการโอนเงิน</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">✅ ไม่มีรายการที่รออยู่</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li
              key={b.booking_id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <p>
                <strong>คอร์ส:</strong> {b.course.course_title}
              </p>
              <p>
                <strong>นักเรียน:</strong> {b.student.user.name} {b.student.user.surname}
              </p>
              <p>
                <strong>ติวเตอร์:</strong> {b.course.tutor.user.name} {b.course.tutor.user.surname}
              </p>
              <p>
                <strong>จำนวนเงิน:</strong> {b.total_amount} ฿
              </p>
              <button
                onClick={() => handleSettle(b.booking_id)}
                disabled={settling === b.booking_id}
                className="mt-3 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {settling === b.booking_id ? "กำลังโอน..." : "โอนเงินแล้ว"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
