// src/app/admin-actions/bookings/all/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AllBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin-actions/bookings/all")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => {
        console.error(err);
        alert("❌ โหลดข้อมูลล้มเหลว: " + err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderTransferStatus = (status) => {
    switch (status) {
      case "settled":
        return "โอนเงินแล้ว";
      case "completed":
        return "เรียนเสร็จ รอโอน";
      case "confirmed":
        return "ชำระเงินแล้ว";
      default:
        return "-";
    }
  };

  const renderLearningStatus = (status) => {
    switch (status) {
      case "pending":
        return "รอผู้สอนยืนยัน";
      case "confirmed":
        return "รอเรียน";
      case "completed":
      case "settled":
        return "เรียนเสร็จแล้ว";
      case "cancelled":
        return "ยกเลิกแล้ว";
      default:
        return "-";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">⏳ กำลังโหลดรายการจองทั้งหมด…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          รายการจองทั้งหมด
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            🚫 ยังไม่มีการจองใด ๆ
          </p>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "#",
                      "นักเรียน",
                      "ติวเตอร์",
                      "วิชา",
                      "วันที่จอง",
                      "จำนวนเงิน (฿)",
                      "สถานะเรียน",
                      "สถานะโอนเงิน",
                    ].map((th) => (
                      <th
                        key={th}
                        className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => {
                    const date = new Date(b.booking_date).toLocaleString(
                      "th-TH",
                      { dateStyle: "short", timeStyle: "short" }
                    );
                    return (
                      <tr
                        key={b.booking_id}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 text-center text-gray-700">
                          {i + 1}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {b.student.name} {b.student.surname}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {b.course.tutor.user.name} {b.course.tutor.user.surname}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {b.course.subject.name}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{date}</td>
                        <td className="px-6 py-4 text-right text-gray-700">
                          {b.total_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700">
                          {renderLearningStatus(b.status)}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700">
                          {renderTransferStatus(b.status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            ◀️ ย้อนกลับ
          </button>
        </div>
      </div>
    </main>
  );
}
