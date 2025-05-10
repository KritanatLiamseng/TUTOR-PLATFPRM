"use client";

import Image from "next/image";
import { FaUser } from "react-icons/fa";

export default function BookingCard({
  booking,
  isCancelled = false,
  isTutorView = false,
  onConfirm,
  onReject,
  actingOn = false,
}) {
  const {
    booking_id,
    tutor = {},
    student = {},
    booking_date,
    total_amount = 0,
    status,
  } = booking;

  const course = booking.course || {};
  const courseTitle = course?.title || course?.course_title || "ไม่ระบุ";
  const courseSubject = course?.subject?.name || course?.subject || "-";

  // ป้องกันกรณี tutor.user ไม่มีข้อมูล
  const profile = isTutorView
    ? student
    : tutor?.user ?? {
        name: tutor?.name || "-",
        surname: tutor?.surname || "",
        profile_image: tutor?.profile_image || "/default-profile.png",
      };

  const avatarSrc = profile?.profile_image || "/default-profile.png";
  const profileName = `${profile?.name || "ไม่ระบุ"} ${profile?.surname || ""}`;

  const statusText = isCancelled
    ? "ยกเลิกแล้ว"
    : status === "confirmed"
    ? "ยืนยันแล้ว รอชำระเงิน"
    : "รอยืนยัน";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                fill
                className="object-cover"
                alt={profileName}
              />
            ) : (
              <FaUser size={40} className="text-gray-300" />
            )}
          </div>
          <div>
            <p className="font-medium">{profileName}</p>
            <p className="text-sm text-gray-500">วิชา: {courseSubject}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold">{courseTitle}</h3>
        <p className="text-gray-600">
          {new Date(booking_date).toLocaleString("th-TH", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <p className="text-gray-600">{total_amount} ฿</p>
      </div>

      <div className="mt-6 flex items-center justify-end space-x-2">
        {isCancelled ? (
          <span className="px-4 py-1 bg-red-100 text-red-800 rounded-full">ยกเลิกแล้ว</span>
        ) : status === "confirmed" ? (
          <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full font-medium">
            ยืนยันแล้ว รอชำระเงิน
          </span>
        ) : isTutorView ? (
          <>
            <button
              onClick={onConfirm}
              disabled={actingOn}
              className="px-4 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
            >
              {actingOn ? "กำลัง..." : "✅ ยืนยัน"}
            </button>
            <button
              onClick={onReject}
              disabled={actingOn}
              className="px-4 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
            >
              {actingOn ? "กำลัง..." : "❌ ปฏิเสธ"}
            </button>
          </>
        ) : (
          <button
            onClick={onReject}
            disabled={actingOn}
            className="px-4 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
          >
            {actingOn ? "กำลัง..." : "ยกเลิก"}
          </button>
        )}
      </div>
    </div>
  );
}
