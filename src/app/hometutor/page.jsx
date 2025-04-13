"use client";

import Header from "../components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser, FaHistory, FaFileAlt, FaQuestionCircle,
  FaInfoCircle, FaSignOutAlt, FaWallet, FaTrash, FaEdit
} from "react-icons/fa";

const HomeTutorPage = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({ subject_name: "", level: "", description: "" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return setLoading(false);

    const fetchData = async () => {
      try {
        const userRes = await fetch(`/api/user/${userId}`);
        const userData = await userRes.json();
        setUser(userData);

        const courseRes = await fetch(`/api/tutor/${userId}/courses`);
        const courseData = await courseRes.json();
        setCourses(courseData);
      } catch (err) {
        console.error("เกิดข้อผิดพลาด:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const handleSaveCourse = async () => {
    if (!newCourse.subject_name || !newCourse.level) return;

    const userId = localStorage.getItem("userId");
    const res = await fetch(`/api/tutor/${userId}/courses`, {
      method: editingCourse ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCourse, course_id: editingCourse?.course_id }),
    });

    const result = await res.json();
    if (res.ok) {
      setCourses((prev) =>
        editingCourse
          ? prev.map((c) => (c.course_id === editingCourse.course_id ? result : c))
          : [...prev, result]
      );
      setNewCourse({ subject_name: "", level: "", description: "" });
      setEditingCourse(null);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const userId = localStorage.getItem("userId");
    await fetch(`/api/tutor/${userId}/courses`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId }),
    });

    setCourses(courses.filter((c) => c.course_id !== courseId));
  };

  const menuItems = [
    { label: "ข้อมูลของฉัน", path: "/tutorprofile", icon: <FaUser className="text-blue-500" /> },
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

  if (loading) return <p className="text-center mt-10">กำลังโหลดข้อมูล...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">ไม่พบข้อมูล</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans">
      <Header dropdownItems={menuItems} />
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
        {/* ติวเตอร์โปรไฟล์ */}
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col md:flex-row gap-6">
          <div className="w-28 h-28 bg-blue-300 rounded-full overflow-hidden">
            <img src={user.profile_image || "/default-profile.png"} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500">ติวเตอร์</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm text-gray-700">
              <div><b>วุฒิการศึกษา:</b> {user.education_level || "-"}</div>
              <div><b>ประสบการณ์:</b> {user.experience_years || 0} ปี</div>
              <div><b>ตารางสอน:</b> {user.available_time || "-"}</div>
              <div><b>อัตราค่าบริการ:</b> {user.rate_per_hour || 0} บาท/ชม</div>
            </div>
          </div>
        </div>

        {/* จัดการคอร์ส */}
        <div className="bg-white shadow rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">📚 คอร์สที่เปิดสอน</h2>
          <ul className="space-y-2 text-gray-700">
            {courses.map((course) => (
              <li key={course.course_id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
                <div>
                  <p className="font-semibold">{course.subject_name} ({course.level})</p>
                  <p className="text-sm">{course.description}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => {
                    setNewCourse(course);
                    setEditingCourse(course);
                  }} className="text-blue-600 hover:underline"><FaEdit /></button>
                  <button onClick={() => handleDeleteCourse(course.course_id)} className="text-red-500 hover:underline"><FaTrash /></button>
                </div>
              </li>
            ))}
          </ul>

          {/* เพิ่ม/แก้ไขคอร์ส */}
          <div className="mt-6 space-y-2">
            <input type="text" placeholder="ชื่อวิชา" className="input" value={newCourse.subject_name}
              onChange={(e) => setNewCourse({ ...newCourse, subject_name: e.target.value })} />
            <input type="text" placeholder="ระดับชั้น" className="input" value={newCourse.level}
              onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })} />
            <textarea placeholder="คำอธิบาย" className="input h-24"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} />
            <button onClick={handleSaveCourse} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              {editingCourse ? "บันทึกการแก้ไข" : "เพิ่มคอร์ส"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTutorPage;
