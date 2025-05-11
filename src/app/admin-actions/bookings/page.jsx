// src/app/admin-actions/bookings/page.jsx
"use client";

import { useState, useEffect } from "react";

export default function PendingTransferPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settlingId, setSettlingId] = useState(null);

  useEffect(() => {
    // เรียก API ฝั่ง Admin
    fetch("/api/admin-actions/bookings")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ โหลดข้อมูลล้มเหลว: " + err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSettle = async (id) => {
    if (!confirm("โอนเงินให้ติวเตอร์เรียบร้อยหรือไม่?")) return;
    setSettlingId(id);
    const res = await fetch(`/api/admin-actions/bookings/${id}/settle`, {
      method: "POST",
    });
    if (res.ok) {
      // ดึงรายการที่โอนแล้วออก
      setBookings((bs) => bs.filter((b) => b.booking_id !== id));
    } else {
      const err = await res.json();
      alert("❌ " + (err.error || "โอนเงินไม่สำเร็จ"));
    }
    setSettlingId(null);
  };

  if (loading) {
    return <p className="p-4">⏳ กำลังโหลดข้อมูล…</p>;
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">การจองที่รอการโอนเงิน</h1>
      {bookings.length === 0 ? (
        <p className="text-green-600">✅ ไม่มีรายการที่รออยู่</p>
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
                <strong>นักเรียน:</strong> {b.student.name} {b.student.surname}
              </p>
              <p>
                <strong>ติวเตอร์:</strong>{" "}
                {b.course.tutor.user.name} {b.course.tutor.user.surname}
              </p>
              <p>
                <strong>จำนวนเงิน:</strong> {b.total_amount} ฿
              </p>
              <button
                onClick={() => handleSettle(b.booking_id)}
                disabled={settlingId === b.booking_id}
                className="mt-3 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {settlingId === b.booking_id ? "กำลังโอน..." : "โอนเงินแล้ว"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
