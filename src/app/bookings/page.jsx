"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => {
        console.error("❌ โหลดการจองล้มเหลว:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-center text-gray-600">กำลังโหลดการจอง...</p>;
  }

  if (!bookings.length) {
    return <p className="p-6 text-center text-gray-500">ยังไม่มีรายการจอง</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">รายการจองของคุณ</h1>
      <ul className="space-y-4">
        {bookings.map((b) => (
          <li key={b.booking_id} className="border rounded-lg p-4 hover:shadow">
            <Link
              href={`/bookings/${b.booking_id}`}
              className="block sm:flex justify-between items-center"
            >
              <div>
                <p className="font-medium">คอร์ส: {b.course.course_title}</p>
                <p className="text-sm text-gray-600">
                  ติวเตอร์: {b.tutor.user.name}
                </p>
                <p className="text-sm text-gray-600">
                  วันที่จอง: {new Date(b.booking_date).toLocaleString()}
                </p>
              </div>
              <span className="mt-2 sm:mt-0 text-blue-600 hover:underline">
                ดูรายละเอียด →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
