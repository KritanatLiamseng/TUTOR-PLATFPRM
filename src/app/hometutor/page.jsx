"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import {
  FaUser,
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
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return setLoading(false);

    Promise.all([
      fetch(`/api/user/${userId}`).then((res) => res.json()),
      fetch(`/api/tutor/${userId}/courses`).then((res) => res.json()),
    ])
      .then(([userData, courseData]) => {
        setUser(userData);
        setCourses(courseData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const handleDelete = async (courseId) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้?")) {
      const res = await fetch(`/api/tutor/courses/${courseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
      }
    }
  };

  const menuItems = [
    { label: "ประวัติการจอง", path: "/booking-history", icon: <FaHistory className="text-blue-500" /> },
    { label: "บัญชีของฉัน", path: "/account", icon: <FaWallet className="text-blue-500" /> },
    { label: "นโยบาย", path: "/policy", icon: <FaFileAlt className="text-blue-500" /> },
    { label: "ศูนย์ช่วยเหลือ", path: "/support", icon: <FaQuestionCircle className="text-blue-500" /> },
    { label: "รายงาน", path: "/report", icon: <FaInfoCircle className="text-blue-500" /> },
    {
      label: "ออกจากระบบ",
      path: "#",
      icon: <FaSignOutAlt className="text-red-500" />,
      onClick: handleLogout,
    },
  ];

  if (loading) return <p className="text-center mt-10 text-gray-600">กำลังโหลด...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">ไม่พบข้อมูลผู้ใช้</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white font-sans">
      <Header dropdownItems={menuItems} />
      <div className="max-w-5xl mx-auto space-y-8 py-10 px-4">

        {/* 📌 โปรไฟล์ติวเตอร์ */}
        <div className="bg-white rounded-2xl shadow-lg p-6 relative flex flex-col md:flex-row items-center gap-6">
          {/* ปุ่มแก้ไขด้านขวาบน */}
          <button
            onClick={() => router.push("/edittutor")}
            className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
          >
            ✏️ แก้ไขโปรไฟล์
          </button>

          <div className="w-28 h-28 bg-blue-300 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={user.profile_image || "/default-profile.png"}
              alt="avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/default-profile.png";
              }}
            />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">ติวเตอร์</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-sm text-gray-700">
              <div><FaPhone className="inline mr-1" /> <strong>เบอร์โทร:</strong> {user.phone || "-"}</div>
              <div><FaIdCard className="inline mr-1" /> <strong>ชื่อผู้ใช้:</strong> {user.username || "-"}</div>
              <div><FaEnvelope className="inline mr-1" /> <strong>อีเมล:</strong> {user.email}</div>
              <div><strong>ระดับการศึกษา:</strong> {user.education_level || "-"}</div>
              <div><strong>ประสบการณ์:</strong> {user.experience_years || 0} ปี</div>
              <div><strong>ตารางสอน:</strong> {user.available_time || "-"}</div>
              
            </div>
          </div>
        </div>

        {/* 📚 คอร์สที่เปิดสอน */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">📚 คอร์สที่เปิดสอน</h2>
            <button
              onClick={() => router.push("/tutor/courses/new")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> เพิ่มคอร์สใหม่
            </button>
          </div>
          {courses.length > 0 ? (
            <ul className="space-y-3">
              {courses.map((course) => (
                <li key={course.course_id} className="bg-gray-50 px-4 py-3 rounded-lg shadow-sm flex justify-between items-start">
                  <div>
                    <strong>{course.course_title}</strong> ({course.level})<br />
                    <span className="text-sm text-gray-600">{course.course_description}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/tutor/courses/edit/${course.course_id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="แก้ไข"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(course.course_id)}
                      className="text-red-600 hover:text-red-800"
                      title="ลบ"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 italic">ยังไม่มีข้อมูลคอร์ส</div>
          )}
        </div>
      </div>
    </div>
  );
}
