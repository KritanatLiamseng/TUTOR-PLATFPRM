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
  const isRefundable = booking.status === "cancelled" && hasPaid && !booking.refunded;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-8 border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          <CreditCard className="text-blue-600 w-7 h-7" />
          รายละเอียดการชำระเงิน
        </h1>

        <div className="grid md:grid-cols-2 gap-8 text-gray-800 text-base md:text-lg">
          <div className="space-y-4">
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
          </div>

          <div className="space-y-4">
            <p className="flex items-center gap-2">
              <CalendarClock className="text-orange-500" />
              <strong>วันเวลาเริ่ม:</strong>{" "}
              {new Date(booking.booking_date).toLocaleString("th-TH", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>

            {!hasPaid && (
              <p className="text-red-600 flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5" />
                ⚠️ โปรดชำระเงินก่อนถึงเวลาเรียน
              </p>
            )}
          </div>
        </div>

        {/* 💰 ยอดชำระ */}
        <div className="pt-6 border-t border-gray-200">
          <p className="flex items-center gap-2 text-xl font-semibold text-black justify-center">
            <BadgeDollarSign className="text-yellow-600 w-6 h-6" />
            ยอดที่ต้องชำระ: {Number(booking.total_amount).toFixed(2)} บาท
          </p>
        </div>

        {/* ปุ่มดำเนินการ */}
        <div className="space-y-4 pt-4">
          {booking.status === "confirmed" && !hasPaid && (
            <button
              onClick={() => router.push(`/payment/${booking.booking_id}/confirm`)}
              className="w-full py-4 rounded-xl bg-blue-600 text-white text-xl font-semibold hover:bg-blue-700 transition"
            >
              💳 ดำเนินการชำระเงิน
            </button>
          )}

          {booking.status === "confirmed" && hasPaid && (
            <button
              onClick={async () => {
                if (!window.confirm("คุณยืนยันหรือไม่ว่าได้เรียนเสร็จแล้ว?")) return;
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
              className="w-full py-4 rounded-xl bg-green-600 text-white text-xl font-semibold hover:bg-green-700 transition"
            >
              ✅ ยืนยันว่าเรียนเสร็จแล้ว
            </button>
          )}

          {isRefundable && (
            <button
              onClick={async () => {
                if (!window.confirm("คุณต้องการขอคืนเงินใช่หรือไม่?")) return;
                const res = await fetch(`/api/refunds/${booking.booking_id}`, { method: "POST" });
                const data = await res.json();
                if (!res.ok) {
                  alert("❌ ไม่สามารถขอคืนเงินได้: " + (data.error || "unknown"));
                  return;
                }

                alert("✅ ระบบได้ดำเนินการคืนเงินเรียบร้อยแล้ว");
                setBooking({ ...booking, refunded: true });
              }}
              className="w-full py-4 rounded-xl bg-red-600 text-white text-xl font-semibold hover:bg-red-700 transition"
            >
              💸 ขอคืนเงิน
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
