"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentConfirmPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/bookings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) throw new Error(data.error || "ไม่พบข้อมูล");
        setBooking(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);

  const handleConfirm = async () => {
    const ok = confirm("คุณยืนยันว่าจะดำเนินการชำระเงิน?");
    if (!ok) return;

    setLoading(true);

    const res = await fetch(`/api/payments/${id}/pay`, { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      alert("❌ ชำระเงินไม่สำเร็จ: " + (data.error || "unknown"));
    } else {
      alert("✅ ชำระเงินสำเร็จแล้ว");
      router.push(`/payment/${id}`);
    }

    setLoading(false);
  };

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-10 bg-white rounded-xl shadow space-y-6">
        <p className="text-red-600 text-center">❌ {error}</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-10 bg-white rounded-xl shadow space-y-6">
        <p className="text-center">⏳ กำลังโหลดข้อมูล…</p>
      </div>
    );
  }

  // สร้าง URL สำหรับ QR Code โดยใช้ข้อมูลการจอง
  const paymentUrl = `https://example.com/pay/${booking.booking_id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    paymentUrl
  )}`;

  return (
    <div className="max-w-xl mx-auto p-8 mt-10 bg-white rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-center">ยืนยันการชำระเงิน</h1>
      <p className="text-center text-gray-700">
        กรุณาสแกน QR Code ด้านล่างเพื่อชำระเงิน
      </p>

      <div className="flex justify-center">
        <img
          src={qrCodeUrl}
          alt="QR Code สำหรับชำระเงิน"
          className="w-48 h-48"
        />
      </div>

      <div className="text-center">
        <button
          disabled={loading}
          onClick={handleConfirm}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          {loading ? "⏳ กำลังดำเนินการ..." : "✅ ยืนยันการชำระเงิน"}
        </button>
      </div>
    </div>
  );
}
