"use client";
import { useRouter } from "next/navigation";
import FooterNav from "@/app/components/FooterNav";
import { FaUser, FaPhone, FaEnvelope, FaIdCard, FaUserEdit } from "react-icons/fa";

const StudentProfilePage = () => {
    const router = useRouter();

    const handleEditClick = () => {
        router.push("/studentprofile/edit");
    };

    const profileData = [
        { label: "ชื่อ", value: "สมชาย ใจดี", icon: <FaUser className="text-blue-500 mr-3" /> },
        { label: "เบอร์โทร", value: "081-234-5678", icon: <FaPhone className="text-green-500 mr-3" /> },
        { label: "อีเมล์", value: "somchai@email.com", icon: <FaEnvelope className="text-red-500 mr-3" /> },
        { label: "ชื่อผู้ใช้", value: "somchai_jd", icon: <FaIdCard className="text-purple-500 mr-3" /> },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-300 to-white">
            
            {/* Header */}
            <header className="bg-white/50 backdrop-blur-lg shadow-md w-full text-center py-6">
                <h2 className="text-3xl font-bold text-gray-700">👤 โปรไฟล์ของฉัน</h2>
            </header>

            {/* กล่องข้อมูลโปรไฟล์ */}
            <div className="w-full max-w-2xl mt-6 p-6">
                
                {/* รูปโปรไฟล์ */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 bg-blue-400 rounded-full flex items-center justify-center shadow-md text-white text-lg font-bold">
                        S
                    </div>
                </div>

                {/* รายละเอียดโปรไฟล์ */}
                <div className="space-y-4">
                    {profileData.map((item, index) => (
                        <div key={index} className="bg-white/50 backdrop-blur-lg p-4 rounded-lg shadow-md flex items-center">
                            {item.icon}
                            <div className="flex-1">
                                <span className="block text-gray-600 text-sm">{item.label}</span>
                                <span className="block text-gray-800 font-semibold">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ปุ่มแก้ไข */}
                <button 
                    className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg shadow-lg text-lg flex items-center justify-center transition"
                    onClick={handleEditClick} 
                >
                    <FaUserEdit className="mr-2" /> แก้ไขข้อมูล
                </button>
            </div>

            <FooterNav active="โปรไฟล์" />
        </div>
    );
};

export default StudentProfilePage;
