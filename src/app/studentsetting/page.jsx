"use client";
import Link from "next/link";
import FooterNav from "@/app/components/FooterNav";
import {
  FaUser,
  FaHistory,
  FaFileAlt,
  FaQuestionCircle,
  FaExclamationCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Setting() {
  const router = useRouter();

  const menuItems = [
    { icon: <FaUser />, label: "ข้อมูลของฉัน", link: "/studentprofile" },
    { icon: <FaHistory />, label: "ประวัติการจอง", link: "/booking-history" },
    { icon: <FaFileAlt />, label: "นโยบาย", link: "/policy" },
    { icon: <FaQuestionCircle />, label: "ศูนย์ช่วยเหลือ", link: "/support" },
    { icon: <FaExclamationCircle />, label: "รายงาน", link: "/report" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-sky-100 via-white to-white">
      {/* Header */}
      <header className="w-full py-6 text-center shadow-sm bg-white/90 backdrop-blur-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">⚙️ การตั้งค่า</h2>
      </header>

      {/* Menu Section */}
      <main className="w-full max-w-md px-6 py-8 space-y-4 flex-grow">
        {menuItems.map((item, index) => (
          <Link href={item.link} key={index} className="block">
            <div className="flex items-center bg-white rounded-xl shadow-sm px-5 py-4 hover:shadow-md hover:bg-blue-50 transition duration-200">
              <div className="text-blue-500 text-xl mr-4">{item.icon}</div>
              <span className="text-gray-800 text-base font-medium">{item.label}</span>
            </div>
          </Link>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl shadow-md text-base font-semibold flex items-center justify-center gap-2 transition"
        >
          <FaSignOutAlt />
          ออกจากระบบ
        </button>
      </main>

      <FooterNav active="การตั้งค่า" />
    </div>
  );
}
