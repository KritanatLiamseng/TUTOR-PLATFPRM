"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CreditCard,
  CalendarClock,
  BookOpenText,
  UserRound,
  BadgeDollarSign,
  AlertCircle,
} from "lucide-react";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/bookings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) throw new Error(data.error || "ไม่พบข้อมูล");
        setBooking(data);
      })
      .catch((err) => {
        alert("เกิดข้อผิดพลาด: " + err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">⏳ กำลังโหลดข้อมูล…</p>;
  if (!booking) return <p className="p-6 text-red-600">❌ ไม่พบข้อมูลการจอง</p>;

  const hasPaid = booking.payments?.some((p) => p.paid);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6 mt-10 border border-gray-200">
      <h1 className="text-3xl font-bold flex items-center space-x-2">
        <CreditCard className="text-blue-600 w-6 h-6" />
        <span>รายละเอียดการชำระเงิน</span>
      </h1>

      <div className="space-y-4 text-gray-800 text-lg">
        <p className="flex items-center gap-2">
          <BookOpenText className="text-indigo-500" />
          <strong>รหัสการจอง:</strong> {booking.booking_id}
        </p>

        <p className="flex items-center gap-2">
          <BookOpenText className="text-purple-600" />
          <strong>วิชา:</strong> {booking.course?.course_title} ({booking.course?.subject})
        </p>

        <p className="flex items-center gap-2">
          <UserRound className="text-green-600" />
          <strong>ผู้สอน:</strong> {booking.course?.tutor?.name} {booking.course?.tutor?.surname}
        </p>

        <p className="flex items-center gap-2">
          <CalendarClock className="text-orange-500" />
          <strong>วันเวลาเริ่ม:</strong>{" "}
          {new Date(booking.booking_date).toLocaleString("th-TH", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>

        <p className="flex items-center gap-2 text-xl text-black font-semibold">
          <BadgeDollarSign className="text-yellow-600" />
          <strong>ยอดเงินที่ต้องชำระ:</strong>{" "}
          {Number(booking.total_amount).toFixed(2)} บาท
        </p>

        {!hasPaid && (
          <p className="text-red-600 flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5" />
            ⚠️ โปรดดำเนินการชำระเงินก่อนเริ่มเรียน
          </p>
        )}
      </div>

      {/* ✅ ปุ่มไปหน้ายืนยันการชำระเงิน */}
      {booking.status === "confirmed" && !hasPaid && (
        <div className="pt-6 border-t">
          <button
            onClick={() => router.push(`/payment/${booking.booking_id}/confirm`)}
            className="w-full px-6 py-3 mt-4 rounded-lg bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition"
          >
            💳 ดำเนินการชำระเงิน
          </button>
        </div>
      )}

      {/* ✅ ปุ่มยืนยันเรียนเสร็จ */}
      {booking.status === "confirmed" && hasPaid && (
        <div className="pt-6 border-t mt-8">
          <button
            onClick={async () => {
              const confirm = window.confirm("คุณยืนยันหรือไม่ว่าได้เรียนเสร็จแล้ว?");
              if (!confirm) return;

              const res = await fetch(`/api/bookings/${booking.booking_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "completed" }),
              });

              const data = await res.json();
              if (!res.ok) {
                alert("❌ ไม่สามารถอัปเดตสถานะได้: " + (data.error || "unknown"));
                return;
              }

              alert("✅ ขอบคุณที่ยืนยัน ระบบได้จ่ายเงินให้ติวเตอร์แล้ว");
              setBooking({ ...booking, status: "completed" });
            }}
            className="w-full px-6 py-3 mt-4 rounded-lg bg-green-600 text-white text-lg font-semibold hover:bg-green-700 transition"
          >
            ✅ ยืนยันว่าเรียนเสร็จแล้ว
          </button>
        </div>
      )}
    </div>
  );
}
