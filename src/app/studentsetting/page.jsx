"use client";
import Link from "next/link";
import FooterNav from "@/app/components/FooterNav";
import { 
    FaUser, 
    FaHistory, 
    FaFileAlt, 
    FaQuestionCircle, 
    FaExclamationCircle, 
    FaSignOutAlt
} from "react-icons/fa";
import { useRouter } from "next/navigation"; 
import Image from "next/image";

export default function Setting() {
  const router = useRouter();

  const menuItems = [
    { icon: <FaUser />, label: "ข้อมูลของฉัน", link: "/studentprofile" },
    { icon: <FaHistory />, label: "ประวัติการจอง", link: "/booking-history" },
    { icon: <FaFileAlt />, label: "นโยบาย", link: "/policy" },
    { icon: <FaQuestionCircle />, label: "ศูนย์ช่วยเหลือ", link: "/support" },
    { icon: <FaExclamationCircle />, label: "รายงาน", link: "/report" },
  ];

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem("userToken"); 
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-300 to-white">

      {/* Header */}
      <header className="w-full text-center py-6">
        <h2 className="text-3xl font-bold text-gray-700">⚙️ การตั้งค่า</h2>
      </header>

      {/* รายการเมนู */}
      <div className="w-full max-w-2xl mt-6 space-y-4 px-4">
        {menuItems.map((item, index) => (
          <Link href={item.link} key={index} className="block">
            <div className="flex items-center p-4 rounded-lg shadow-md hover:bg-blue-100 transition cursor-pointer bg-white/50 backdrop-blur-lg">
              <div className="text-2xl text-blue-500 mr-4">{item.icon}</div>
              <span className="text-lg flex-1 text-gray-700">{item.label}</span>
            </div>
          </Link>
        ))}

        {/* ปุ่มออกจากระบบ */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center bg-red-500 text-white px-4 py-3 rounded-lg shadow-md hover:bg-red-600 transition mt-6"
        >
          <FaSignOutAlt className="mr-2" /> ออกจากระบบ
        </button>
      </div>

      <FooterNav />
    </div>
  );
}