"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaIdCard, FaLock, FaUpload } from "react-icons/fa";
import FooterNav from "@/app/components/FooterNav";

const EditProfile = () => {
    const router = useRouter();
    const [profileImage, setProfileImage] = useState(null);

    const handleSave = () => {
        router.push("/studentprofile");
    };

    const handleBack = () => {
        router.back();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const profileFields = [
        { label: "ชื่อ", placeholder: "กรอกชื่อของคุณ", icon: <FaUser className="text-blue-500 mr-3" /> },
        { label: "เบอร์โทร", placeholder: "กรอกเบอร์โทรศัพท์", icon: <FaPhone className="text-green-500 mr-3" /> },
        { label: "อีเมล์", placeholder: "กรอกอีเมล์ของคุณ", icon: <FaEnvelope className="text-red-500 mr-3" /> },
        { label: "ชื่อผู้ใช้", placeholder: "กรอกชื่อผู้ใช้ (Username)", icon: <FaIdCard className="text-purple-500 mr-3" /> },
        { label: "รหัสผ่าน", placeholder: "กรอกรหัสผ่านของคุณ", icon: <FaLock className="text-gray-500 mr-3" /> },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-300 to-white">
            
            {/* Header */}
            <header className="w-full bg-white/50 backdrop-blur-lg shadow-md p-4 flex items-center">
                <button onClick={handleBack} className="text-gray-700 hover:text-blue-500 transition mr-2">
                    <FaArrowLeft className="text-2xl" />
                </button>
                <h2 className="text-xl font-bold text-gray-700">แก้ไขโปรไฟล์</h2>
            </header>

            {/* กล่องแก้ไขโปรไฟล์ */}
            <div className="w-full max-w-2xl mt-6 p-6">
                
                {/* รูปโปรไฟล์ */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32 mb-4">
                        <div className="w-full h-full bg-gray-200 rounded-full shadow-md overflow-hidden flex items-center justify-center">
                            {profileImage ? (
                                <img src={profileImage} alt="โปรไฟล์" className="w-full h-full object-cover" />
                            ) : (
                                <img src="/default-profile.png" alt="รูปโปรไฟล์" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <label className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-1 rounded-b-md cursor-pointer flex items-center justify-center">
                            <FaUpload className="mr-1" /> อัปโหลด
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                {/* ฟอร์มแก้ไขข้อมูล */}
                <div className="space-y-4">
                    {profileFields.map((field, index) => (
                        <div key={index} className="bg-white/70 backdrop-blur-lg p-4 rounded-lg shadow-md flex items-center">
                            {field.icon}
                            <input 
                                type="text"
                                placeholder={field.placeholder}
                                className="flex-1 bg-transparent text-gray-700 focus:outline-none"
                            />
                        </div>
                    ))}
                </div>

                {/* ปุ่มบันทึก */}
                <button
                    onClick={handleSave}
                    className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg shadow-lg text-lg transition"
                >
                    บันทึกข้อมูล
                </button>
            </div>

            <FooterNav active="โปรไฟล์" />
        </div>
    );
};

export default EditProfile;
