"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setBooking(data))
      .catch((err) => {
        console.error("❌ โหลดรายละเอียดจองล้มเหลว:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="p-6 text-center text-gray-600">กำลังโหลดข้อมูล...</p>;
  }
  if (!booking) {
    return <p className="p-6 text-center text-red-500">ไม่พบข้อมูลการจอง</p>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline text-sm"
      >
        ← กลับ
      </button>
      <h1 className="text-2xl font-semibold">{booking.course.course_title}</h1>
      <div className="text-gray-700">
        <p>
          <strong>ติวเตอร์:</strong> {booking.tutor.user.name}
        </p>
        <p>
          <strong>วันที่จอง:</strong>{" "}
          {new Date(booking.booking_date).toLocaleString()}
        </p>
        <p>
          <strong>สถานะ:</strong> {booking.status}
        </p>
        <p>
          <strong>ยอดชำระ:</strong> {booking.total_amount} บาท
        </p>
      </div>
      <Link
        href="/booking-history"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ไปที่ประวัติการจอง
      </Link>
    </div>
  );
}
