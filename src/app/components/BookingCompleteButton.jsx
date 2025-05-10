"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingCompleteButton({ bookingId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleComplete = async () => {
    const confirm = window.confirm("คุณต้องการยืนยันว่าเรียนเสร็จแล้วใช่หรือไม่?");
    if (!confirm) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "อัปเดตไม่สำเร็จ");
      setSuccess(true);
      alert("✅ ยืนยันการเรียนเสร็จแล้ว ระบบจะโอนเงินให้ติวเตอร์");
      router.refresh();
    } catch (err) {
      alert("❌ เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleComplete}
        disabled={loading || success}
        className={`px-6 py-3 rounded-lg text-white text-lg font-medium shadow-md transition duration-200
          ${success ? "bg-green-600" : loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {success ? "✅ ยืนยันแล้ว" : loading ? "กำลังยืนยัน…" : "ยืนยันว่าเรียนเสร็จแล้ว"}
      </button>
    </div>
  );
}
