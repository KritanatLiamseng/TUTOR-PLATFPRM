"use client";

import Header from "../components/header";
import { useEffect, useState } from "react";
import {
  FaUser,
  FaHistory,
  FaFileAlt,
  FaQuestionCircle,
  FaInfoCircle,
  FaSignOutAlt,
  FaWallet,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const HomeTutorPage = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setLoading(false);
      return;
    }

    // โหลดข้อมูลผู้ใช้ + คอร์ส
    fetch(`/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        return fetch(`/api/tutor/${userId}/courses`);
      })
      .then((res) => res.text()) // ป้องกัน JSON parse error
      .then((text) => {
        const courseData = text ? JSON.parse(text) : [];
        setCourses(courseData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("เกิดข้อผิดพลาด:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const menuItems = [
    {
      label: "ข้อมูลของฉัน",
      path: "/tutorprofile",
      icon: <FaUser className="text-blue-500" />,
    },
    {
      label: "ประวัติการจอง",
      path: "/booking-history",
      icon: <FaHistory className="text-blue-500" />,
    },
    {
      label: "บัญชีของฉัน",
      path: "/account",
      icon: <FaWallet className="text-blue-500" />,
    },
    {
      label: "นโยบาย",
      path: "/policy",
      icon: <FaFileAlt className="text-blue-500" />,
    },
    {
      label: "ศูนย์ช่วยเหลือ",
      path: "/support",
      icon: <FaQuestionCircle className="text-blue-500" />,
    },
    {
      label: "รายงาน",
      path: "/report",
      icon: <FaInfoCircle className="text-blue-500" />,
    },
    {
      label: "ออกจากระบบ",
      path: "#",
      icon: <FaSignOutAlt className="text-red-500" />,
      onClick: handleLogout,
    },
  ];

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        กำลังโหลดข้อมูล...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500">
        ไม่พบข้อมูลผู้ใช้ หรือยังไม่ได้เข้าสู่ระบบ
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white font-sans">
      <Header dropdownItems={menuItems} />

      <div className="max-w-5xl mx-auto space-y-8 py-10 px-4">
        {/* Tutor Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 bg-blue-300 rounded-full overflow-hidden flex items-center justify-center shadow-md">
            <img
              src={user.profile_image || "/default-profile.png"}
              alt="รูปโปรไฟล์"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">ติวเตอร์</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-sm text-gray-700">
              <div><strong>วุฒิการศึกษา:</strong> {user.education_level || "-"}</div>
              <div><strong>ประสบการณ์:</strong> {user.experience_years || 0} ปี</div>
              <div><strong>ตารางสอน:</strong> {user.available_time || "-"}</div>
              <div><strong>อัตราค่าบริการ:</strong> {user.rate_per_hour || 0} บาท/ชั่วโมง</div>
              <div><strong>รายละเอียดวิชา:</strong> {user.subject_details || "-"}</div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📚 คอร์สที่เปิดสอน</h2>
          {courses.length > 0 ? (
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              {courses.map((course) => (
                <li key={course.course_id}>
                  {course.subject_name} ({course.level}) - {course.description}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 text-sm italic">ยังไม่มีข้อมูลคอร์ส</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeTutorPage;
