"use client";

import FooterBar from "@/app/components/Footerbar";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaHistory,
  FaFileAlt,
  FaQuestionCircle,
  FaInfoCircle,
  FaSignOutAlt,
  FaWallet,
} from "react-icons/fa";

const SettingTutorPage = () => {
  const router = useRouter();

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
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white via-blue-50 to-blue-100">
      <header className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-700">⚙️ ตั้งค่าโปรไฟล์ติวเตอร์</h1>
      </header>

      <div className="w-full max-w-md px-6 py-4 bg-white rounded-2xl shadow-xl space-y-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item.path)}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-100 transition-all shadow-sm"
          >
            {item.icon}
            <span className="text-lg text-gray-700 font-medium">{item.label}</span>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-400 to-red-600 text-white py-4 rounded-xl shadow-md text-lg font-bold hover:opacity-90 transition"
        >
          <FaSignOutAlt className="inline-block mr-2" /> ออกจากระบบ
        </button>
      </div>

      <div className="mt-auto w-full">
        <FooterBar active="โปรไฟล์" />
      </div>
    </div>
  );
};

export default SettingTutorPage;
