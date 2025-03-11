"use client";

import { useRouter } from "next/navigation";
import { FaHome, FaBook, FaComments, FaUser } from "react-icons/fa";

const FooterBar = ({ active }) => {
    const router = useRouter();

    const menuItems = [
        { name: "Home", icon: <FaHome />, path: "/home" },
        { name: "การจอง", icon: <FaBook />, path: "/booking" },
        { name: "แชท", icon: <FaComments />, path: "/chat" },
        { name: "ตั้งค่า", icon: <FaUser />, path: "/settingtutor" },
    ];

    return (
        <div className="w-full bg-gradient-to-r from-green-200 to-blue-200 flex justify-around items-center py-3 shadow-md fixed bottom-0">
            {menuItems.map((item) => (
                <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`flex flex-col items-center text-sm ${
                        active === item.name ? "text-blue-800" : "text-white"
                    }`}
                >
                    <div className="text-2xl">{item.icon}</div>
                    <span className="mt-1">{item.name}</span>
                </button>
            ))}
        </div>
    );
};

export default FooterBar;
