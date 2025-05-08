"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";

export default function BookingHistoryTutorPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    fetch(`/api/tutor/${userId}`)
      .then((r) => r.json())
      .then((tutor) => {
        if (!tutor || tutor.error || !tutor.tutor_id) {
          console.warn("⚠️ ไม่พบโปรไฟล์ติวเตอร์");
          setLoading(false);
          return;
        }

        fetch(`/api/user/${userId}`)
          .then((r) => r.json())
          .then((u) => {
            if (!u.error) setUser(u);
          });

        fetch(`/api/bookings?tutor_id=${tutor.tutor_id}`)
          .then((res) => {
            if (!res.ok) throw new Error("โหลด booking ไม่สำเร็จ");
            return res.json();
          })
          .then(setBookings)
          .catch((err) => {
            console.error("❌ โหลด booking ล้มเหลว:", err);
            alert("❌ ไม่สามารถโหลดประวัติการจองได้");
          })
          .finally(() => setLoading(false));
      })
      .catch((err) => {
        console.error("❌ โหลดโปรไฟล์ติวเตอร์ล้มเหลว:", err);
        setLoading(false);
      });
  }, [router]);

  const updateStatus = async (bookingId, newStatus) => {
    if (!window.confirm("ยืนยันการเปลี่ยนสถานะ?")) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("อัปเดตสถานะไม่สำเร็จ");

      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      alert("❌ เกิดข้อผิดพลาด: " + err.message);
    }
  };

  const menuItems = [
    { label: "การจองจากนักเรียน", path: "/booking-historytutor" },
    { label: "โปรไฟล์ของคุณ", path: "/tutorprofile" },
    { label: "นโยบาย", path: "/policy" },
    { label: "ศูนย์ช่วยเหลือ", path: "/support" },
    { label: "รายงาน", path: "/report" },
    {
      label: "ออกจากระบบ",
      onClick: () => {
        localStorage.removeItem("userId");
        router.push("/login");
      },
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">กำลังโหลดรายการจองจากนักเรียน…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header dropdownItems={menuItems} user={user} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">
          การจองจากนักเรียน
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">
            ยังไม่มีใครจองคอร์สของคุณ
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
              <div
                key={b.booking_id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-3 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={b.student.profile_image || "/default-profile.png"}
                    alt={`${b.student.name} ${b.student.surname}`}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {b.student.name} {b.student.surname}
                    </p>
                    <p className="text-sm text-gray-500">
                      วิชา: {b.course.subject_name}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>ชื่อคอร์ส: <span className="font-medium text-gray-700">{b.course.title}</span></p>
                  <p>เริ่ม: {new Date(b.booking_date).toLocaleString("th-TH", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}</p>
                  <p>ราคา: {b.total_amount?.toFixed(0)} บาท</p>
                </div>

                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    b.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : b.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {b.status === "pending"
                      ? "รอยืนยัน"
                      : b.status === "confirmed"
                      ? "ยืนยันแล้ว"
                      : "ยกเลิกแล้ว"}
                  </span>
                </div>

                {b.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => updateStatus(b.booking_id, "confirmed")}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-1.5 rounded-md"
                    >
                      ✅ ยืนยัน
                    </button>
                    <button
                      onClick={() => updateStatus(b.booking_id, "cancelled")}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 rounded-md"
                    >
                      ❌ ปฏิเสธ
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
