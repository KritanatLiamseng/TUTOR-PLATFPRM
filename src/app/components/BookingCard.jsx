"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BookingCard({
  booking,
  isTutorView = false,
  onConfirm,
  onReject,
  actingOn = false,
  userRole = "student",
}) {
  const router = useRouter();

  const {
    booking_id,
    course = {},
    tutor = {},
    student = {},
    booking_date,
    total_amount = 0,
    status,
    payments = [],
  } = booking;

  const hasPaid = payments.some((p) => p.paid);

  const courseTitle   = course.course_title || course.title || "ไม่ระบุคอร์ส";
  const courseSubject = course.subject?.name || course.subject || "-";

  // pick profile based on view
  const profile = isTutorView
    ? student
    : tutor.user ?? {
        name: tutor.name || "-",
        surname: tutor.surname || "",
        profile_image: tutor.profile_image || "/default-profile.png",
      };

  const avatarSrc   = profile.profile_image || "/default-profile.png";
  const profileName = `${profile.name} ${profile.surname}`.trim();

  // determine badge
  let statusText  = "";
  let statusColor = "";
  switch (status) {
    case "cancelled":
      statusText  = "ยกเลิกแล้ว";
      statusColor = "bg-red-100 text-red-800";
      break;
    case "settled":
      statusText  = "โอนเงินแล้ว";
      statusColor = "bg-green-100 text-green-800";
      break;
    case "completed":
      statusText  = "กำลังโอนเงินให้ติวเตอร์";
      statusColor = "bg-blue-100 text-blue-800";
      break;
    case "confirmed":
      if (hasPaid) {
        statusText  = "ชำระเงินแล้ว";
        statusColor = "bg-blue-100 text-blue-800";
      } else {
        statusText  = "ยืนยันแล้ว รอชำระเงิน";
        statusColor = "bg-yellow-100 text-yellow-800";
      }
      break;
    default:
      statusText  = "รอยืนยัน";
      statusColor = "bg-gray-100 text-gray-800";
  }

  // student marks complete
  const handleComplete = async () => {
    if (!hasPaid || status !== "confirmed") return;
    if (!confirm("คุณยืนยันว่าเรียนเสร็จแล้วใช่หรือไม่?")) return;

    const res = await fetch(`/api/bookings/${booking_id}/complete`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json();
      alert("❌ ไม่สามารถอัปเดตสถานะได้: " + (err.error || ""));
    } else {
      alert("✅ เรียนเสร็จแล้ว");
      router.refresh();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image src={avatarSrc} fill className="object-cover" alt={profileName} />
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

      {/* Footer */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
        {/* status badge */}
        <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {statusText}
        </span>

        {/* tutor actions */}
        {isTutorView && status === "pending" && (
          <div className="space-x-2">
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
          </div>
        )}

        {/* student payment / completion */}
        {!isTutorView && status === "confirmed" && userRole === "student" && (
          hasPaid ? (
            <button
              onClick={handleComplete}
              disabled={actingOn}
              className="px-4 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
            >
              {actingOn ? "กำลัง..." : "✅ เรียนเสร็จแล้ว"}
            </button>
          ) : (
            <button
              onClick={() => router.push(`/payment/${booking_id}`)}
              className="px-4 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              💳 ไปชำระเงิน
            </button>
          )
        )}
      </div>
    </div>
  );
}
