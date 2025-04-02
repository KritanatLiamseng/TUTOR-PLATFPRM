"use client";

import { FaArrowLeft } from "react-icons/fa";
import FooterBar from "@/app/components/Footerbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EditTutorProfilePage = () => {
    const router = useRouter();
    const [profileImage, setProfileImage] = useState(null);
    const [documentIdCard, setDocumentIdCard] = useState(null);
    const [documentCertificate, setDocumentCertificate] = useState(null);

    const handleSave = () => {
        router.push("/tutorprofile"); // กลับไปหน้าโปรไฟล์ติวเตอร์
    };

    const handleBack = () => {
        router.back(); // กลับไปหน้าก่อนหน้า
    };

    const handleImageChange = (e, setImage) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header */}
            <div className="w-full bg-gradient-to-r from-green-200 to-blue-200 p-4 flex items-center">
                <button onClick={handleBack} className="text-white mr-2">
                    <FaArrowLeft className="text-2xl" />
                </button>
                <h2 className="text-white text-xl font-semibold">แก้ไขโปรไฟล์ติวเตอร์</h2>
            </div>

            {/* Form Edit Profile */}
            <div className="p-4 w-full max-w-lg mx-auto overflow-y-auto">
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32 mb-4">
                        <img
                            src={profileImage || "/default-profile.png"}
                            alt="รูปติวเตอร์"
                            className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleImageChange(e, setProfileImage)}
                        />
                    </div>
                    <span className="text-gray-500">เปลี่ยนรูปโปรไฟล์</span>
                </div>

                {[
                    { label: "ชื่อ-นามสกุล", placeholder: "กรอกชื่อ-นามสกุล" },
                    { label: "วิชาที่สอน", placeholder: "กรอกวิชาที่สอน" },
                    { label: "คอร์สที่เปิดสอน", placeholder: "กรอกคอร์สที่เปิดสอน" },
                    { label: "ประวัติการศึกษา", placeholder: "กรอกประวัติการศึกษา" },
                    { label: "ความพร้อมของตารางเวลา", placeholder: "กรอกความพร้อมของตารางเวลา" },
                    { label: "ราคา คอร์สที่เปิดสอน", placeholder: "กรอกราคา คอร์สที่เปิดสอน" },
                ].map((field, index) => (
                    <div key={index} className="mb-4">
                        <label className="text-gray-700 mb-1 block">{field.label}</label>
                        <input
                            type="text"
                            placeholder={field.placeholder}
                            className="bg-white text-gray-700 w-full py-3 h-14 rounded-lg px-4 shadow-md outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>
                ))}

                {/* Section for uploading documents */}
                <h2 className="text-xl font-semibold my-4">อัปโหลดเอกสารที่เกี่ยวข้อง</h2>
                
                <div className="mb-4">
                    <label className="text-gray-700 mb-1 block">บัตรประชาชน</label>
                    <div className="relative w-full h-32 bg-gray-100 border rounded-lg flex items-center justify-center">
                        {documentIdCard ? (
                            <img
                                src={documentIdCard}
                                alt="บัตรประชาชน"
                                className="w-full h-full object-contain rounded-md"
                            />
                        ) : (
                            <span className="text-gray-500">เลือกไฟล์บัตรประชาชน</span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleImageChange(e, setDocumentIdCard)}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-gray-700 mb-1 block">เอกสารรับรองอื่น ๆ</label>
                    <div className="relative w-full h-32 bg-gray-100 border rounded-lg flex items-center justify-center">
                        {documentCertificate ? (
                            <img
                                src={documentCertificate}
                                alt="เอกสารรับรอง"
                                className="w-full h-full object-contain rounded-md"
                            />
                        ) : (
                            <span className="text-gray-500">เลือกไฟล์เอกสารรับรอง</span>
                        )}
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleImageChange(e, setDocumentCertificate)}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white text-lg w-full py-3 h-14 rounded-lg mt-6 shadow-md"
                >
                    บันทึกข้อมูล
                </button>
            </div>

            <FooterBar active="โปรไฟล์" />
        </div>
    );
};

export default EditTutorProfilePage;
