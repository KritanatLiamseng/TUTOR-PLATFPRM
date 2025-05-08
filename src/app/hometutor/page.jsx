"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/header";
import {
  FaHistory,
  FaFileAlt,
  FaQuestionCircle,
  FaInfoCircle,
  FaSignOutAlt,
  FaWallet,
  FaPlus,
  FaTrash,
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaIdCard,
} from "react-icons/fa";

export default function HomeTutorPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล tutor และคอร์ส
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`/api/user/${userId}`).then((res) => res.json()),
      fetch(`/api/tutor/${userId}/courses`).then((res) => res.json()),
    ])
      .then(([userData, courseData]) => {
        setUser(userData);
        setCourses(Array.isArray(courseData) ? courseData : []);
      })
      .catch((err) => {
        console.error("❌ Error loading tutor data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const handleDelete = async (courseId) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้?")) return;
    const userId = localStorage.getItem("userId");
    const res = await fetch(`/api/tutor/${userId}/courses/${courseId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
    } else {
      const { error } = await res.json().catch(() => ({}));
      alert("❌ ลบคอร์สล้มเหลว: " + (error || "Unknown error"));
    }
  };

  const menuItems = [
    { label: "ประวัติการจอง", path: "/booking-historytutor", icon: <FaHistory /> },
    { label: "บัญชีของฉัน", path: "/hometutor", icon: <FaWallet /> },
    { label: "นโยบาย", path: "/policy", icon: <FaFileAlt /> },
    { label: "ศูนย์ช่วยเหลือ", path: "/support", icon: <FaQuestionCircle /> },
    { label: "รายงาน", path: "/report", icon: <FaInfoCircle /> },
    { label: "ออกจากระบบ", path: "#", icon: <FaSignOutAlt />, onClick: handleLogout },
  ];

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">กำลังโหลด...</p>;
  }
  if (!user) {
    return <p className="text-center mt-10 text-red-500">ไม่พบข้อมูลผู้ใช้</p>;
  }

  // ใช้ userId เดิมเป็น tutorId ใน URL
  const tutorId = localStorage.getItem("userId");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header dropdownItems={menuItems} user={user} />
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-6 relative">
          <button
            onClick={() => router.push("/edittutor")}
            className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
          >
            ✏️ แก้ไขโปรไฟล์
          </button>
          <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-200 flex-shrink-0">
            <img
              src={user.profile_image || "/default-profile.png"}
              alt="avatar"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/default-profile.png")}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">ติวเตอร์</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm">
              <div>
                <FaPhone className="inline mr-1 text-blue-500" />
                {user.phone || "-"}
              </div>
              <div>
                <FaIdCard className="inline mr-1 text-blue-500" />
                {user.username}
              </div>
              <div>
                <FaEnvelope className="inline mr-1 text-blue-500" />
                {user.email}
              </div>
              <div>ระดับการศึกษา: {user.education_level || "-"}</div>
              <div>ประสบการณ์: {user.experience_years || 0} ปี</div>
              <div>เวลาที่ว่าง: {user.available_time || "-"}</div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">คอร์สที่เปิดสอน</h2>
            <button
              onClick={() => router.push(`/tutor/${tutorId}/courses/new`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              <FaPlus /> เพิ่มคอร์สใหม่
            </button>
          </div>

          {courses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.course_id}
                  className="group block bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-800">
                      {course.course_title}
                    </h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          router.push(
                            `/tutor/${tutorId}/courses/${course.course_id}/edit`
                          )
                        }
                        className="text-blue-500"
                        title="แก้ไข"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(course.course_id)}
                        className="text-red-500"
                        title="ลบ"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {course.subject_name} ({course.level})
                  </p>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-3">
                    {course.course_description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                    <span>ราคา: {course.rate_per_hour} บาท/ชม</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {course.teaching_method === "online"
                        ? "ออนไลน์"
                        : "ออฟไลน์"}
                    </span>
                  </div>
                  <div className="mt-4">
                   
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">ยังไม่มีข้อมูลคอร์ส</p>
          )}
        </div>
      </div>
    </div>
  );
}
