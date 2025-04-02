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
    FaWallet 
} from "react-icons/fa";

const SettingTutorPage = () => {
    const router = useRouter();

    const menuItems = [
        { label: "ข้อมูลของฉัน", path: "/tutorprofile", icon: <FaUser className="text-blue-500" /> },
        { label: "ประวัติการจอง", path: "/booking-history", icon: <FaHistory className="text-blue-500" /> },
        { label: "บัญชีของฉัน", path: "/account", icon: <FaWallet className="text-blue-500" /> },
        { label: "นโยบาย", path: "/policy", icon: <FaFileAlt className="text-blue-500" /> },
        { label: "ศูนย์ช่วยเหลือ", path: "/support", icon: <FaQuestionCircle className="text-blue-500" /> },
        { label: "รายงาน", path: "/report", icon: <FaInfoCircle className="text-blue-500" /> },
    ];

    const handleNavigation = (path) => {
        router.push(path);
    };

    const handleLogout = () => {
        router.push("/login");
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-md p-4">
                <div className="flex flex-col gap-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            className="w-full bg-white flex items-center gap-4 text-left p-4 rounded-lg shadow-md hover:bg-gray-100 transition-all"
                        >
                            {item.icon}
                            <span className="text-lg font-semibold text-gray-700">{item.label}</span>
                        </button>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 flex items-center justify-center gap-2 text-white py-4 rounded-full shadow-md text-lg mt-8 hover:bg-red-600 transition-all"
                    >
                        <FaSignOutAlt />
                        ออกจากระบบ
                    </button>
                </div>
            </div>
            <FooterBar active="โปรไฟล์" />
        </div>
    );
};

export default SettingTutorPage;
