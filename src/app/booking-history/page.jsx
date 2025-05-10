"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { FaUser } from "react-icons/fa";

export default function BookingHistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return router.push("/login");

    Promise.all([
      fetch(`/api/user/${uid}`).then((r) => r.json()),
      fetch(`/api/bookings?user_id=${uid}`).then((r) => r.json()),
    ])
      .then(([u, b]) => {
        if (u.error) throw new Error(u.error);
        if (b.error) throw new Error(b.error);
        setUser(u);
        setBookings(b);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ " + err.message);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const mutateStatus = async (bookingId, newStatus) => {
    setActingOn(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: newStatus === "cancelled" ? "DELETE" : "PUT",
        headers: newStatus === "cancelled" ? {} : { "Content-Type": "application/json" },
        body: newStatus === "cancelled" ? undefined : JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "failed");
      }
      setBookings((bs) =>
        bs.map((b) => (b.booking_id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (e) {
      alert("❌ " + e.message);
    } finally {
      setActingOn(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">กำลังโหลดประวัติการจอง…</p>
      </div>
    );
  }

  const isTutor = user.role === "tutor";
  const active = bookings.filter((b) => b.status !== "cancelled");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        dropdownItems={[
          { label: "หน้าหลัก", path: "/" },
          { label: "การจอง", path: "/booking-history" },
          { label: "นโยบาย", path: "/policy" },
          { label: "ศูนย์ช่วยเหลือ", path: "/support" },
          { label: "รายงาน", path: "/report" },
          {
            label: "ออกจากระบบ",
            onClick: () => {
              localStorage.removeItem("userId");
              localStorage.removeItem("role");
              router.push("/login");
            },
          },
        ]}
        user={user}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">ประวัติการจอง</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {isTutor ? "การจองจากนักเรียน" : "การจองปัจจุบัน"}
          </h2>
          {active.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีรายการ</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((b) => (
                <BookingCard
                  key={b.booking_id}
                  booking={b}
                  isTutorView={isTutor}
                  onConfirm={() => mutateStatus(b.booking_id, "confirmed")}
                  onReject={() => mutateStatus(b.booking_id, "cancelled")}
                  actingOn={actingOn === b.booking_id}
                  userRole={user.role}
                />
              ))}
            </div>
          )}
        </section>

        {cancelled.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-red-600">
              การจองที่ยกเลิกแล้ว
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cancelled.map((b) => (
                <BookingCard
                  key={b.booking_id}
                  booking={b}
                  isTutorView={isTutor}
                  isCancelled
                  userRole={user.role}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function BookingCard({
  booking,
  isCancelled,
  isTutorView,
  onConfirm,
  onReject,
  actingOn,
  userRole,
}) {
  const router = useRouter();
  const {
    booking_id,
    course = {},
    tutor: { user: tutorUser } = {},
    student,
    booking_date,
    total_amount,
    status,
  } = booking;

  const title = course.title || course.course_title || "ไม่ระบุคอร์ส";
  const subject = course.subject?.name || course.subject || "-";
  const profile = isTutorView ? student : tutorUser;
  const avatarSrc = profile?.profile_image || "/default-profile.png";
  const profileName = `${profile?.name || "-"} ${profile?.surname || ""}`;

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
            <Image src={avatarSrc} fill className="object-cover" alt={profileName} />
          </div>
          <div>
            <p className="font-medium">{profileName}</p>
            <p className="text-sm text-gray-500">วิชา: {subject}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold">{title}</h3>
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
          <>
            <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full">{statusText}</span>
            {status === "confirmed" && userRole !== "tutor" && (
              <button
                onClick={() => router.push(`/payment/${booking_id}`)}
                className="px-4 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                💳 ไปชำระเงิน
              </button>
            )}
            <button
              onClick={onReject}
              disabled={actingOn}
              className="px-4 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 disabled:opacity-50"
            >
              {actingOn ? "กำลังยกเลิก..." : "ยกเลิก"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
