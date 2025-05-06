// File: src/app/components/BookingButton.jsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function BookingButton({ courseId }) {
  const router = useRouter();

  const handleClick = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("กรุณาเข้าสู่ระบบก่อนจึงจองคอร์สได้");
      router.push("/login");
      return;
    }
    // ส่ง courseId ไปเป็น query
    router.push(`/bookings/new?course=${courseId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
    >
      จองคอร์ส
    </button>
  );
}
