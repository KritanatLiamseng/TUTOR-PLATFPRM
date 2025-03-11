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
import { useRouter } from "next/navigation"; // ใช้งาน useRouter สำหรับเปลี่ยนหน้า
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white relative">
      
      {/* กล่องตั้งค่าแบบ Glassmorphism */}
      <div className="w-full max-w-md mx-auto p-6 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg mt-12">
        
        {/* โลโก้ด้านบน */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.webp"
            alt="Tutor Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>

        {/* หัวข้อ */}
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-2">
          การตั้งค่า
        </h2>
        <p className="text-gray-500 text-center mb-6">
          จัดการบัญชีของคุณและการตั้งค่าต่างๆ
        </p>

        {/* รายการเมนู */}
        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <Link href={item.link} key={index} className="block">
              <div className="flex items-center bg-white/50 backdrop-blur-lg p-4 rounded-lg shadow-md hover:bg-blue-100 transition cursor-pointer">
                <div className="text-2xl text-blue-500 mr-4">{item.icon}</div>
                <span className="text-lg flex-1 text-gray-700">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* ปุ่มออกจากระบบ */}
        <div className="mt-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-500 text-white px-4 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
          >
            <FaSignOutAlt className="mr-2" /> ออกจากระบบ
          </button>
        </div>
      </div>

      <FooterNav />
    </div>
  );
}
