"use client";

import { FaArrowLeft, FaUpload } from "react-icons/fa";
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
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
            
            {/* Header */}
            <div className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-5 flex items-center shadow-lg rounded-b-xl">
                <button onClick={handleBack} className="mr-4 hover:opacity-80 transition">
                    <FaArrowLeft className="text-2xl" />
                </button>
                <h2 className="text-xl font-semibold">แก้ไขโปรไฟล์ติวเตอร์</h2>
            </div>

            {/* Form Edit Profile */}
            <div className="p-6 w-full max-w-3xl mx-auto">
                {/* รูปโปรไฟล์ */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-32 h-32 mb-4 border-4 border-blue-400 rounded-full overflow-hidden shadow-md">
                        <img
                            src={profileImage || "/default-profile.png"}
                            alt="รูปติวเตอร์"
                            className="w-full h-full object-cover"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleImageChange(e, setProfileImage)}
                        />
                    </div>
                    <span className="text-gray-600 text-sm">เปลี่ยนรูปโปรไฟล์</span>
                </div>

                {/* ฟอร์มกรอกข้อมูล */}
                <div className="grid grid-cols-1 gap-6 bg-white/50 backdrop-blur-lg p-6 shadow-lg rounded-xl">
                    {[
                        { label: "ชื่อ-นามสกุล", placeholder: "กรอกชื่อ-นามสกุล" },
                        { label: "วิชาที่สอน", placeholder: "กรอกวิชาที่สอน" },
                        { label: "คอร์สที่เปิดสอน", placeholder: "กรอกคอร์สที่เปิดสอน" },
                        { label: "ประวัติการศึกษา", placeholder: "กรอกประวัติการศึกษา" },
                        { label: "ความพร้อมของตารางเวลา", placeholder: "กรอกความพร้อมของตารางเวลา" },
                        { label: "ราคา คอร์สที่เปิดสอน", placeholder: "กรอกราคา คอร์สที่เปิดสอน" },
                    ].map((field, index) => (
                        <div key={index}>
                            <label className="text-gray-700 font-semibold">{field.label}</label>
                            <input
                                type="text"
                                placeholder={field.placeholder}
                                className="w-full py-3 h-14 rounded-lg px-4 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                            />
                        </div>
                    ))}
                </div>

                {/* อัปโหลดเอกสาร */}
                <h2 className="text-xl font-semibold my-6 text-gray-700">📄 อัปโหลดเอกสารที่เกี่ยวข้อง</h2>

                {[ 
                    { label: "บัตรประชาชน", state: documentIdCard, setState: setDocumentIdCard },
                    { label: "เอกสารรับรองอื่น ๆ", state: documentCertificate, setState: setDocumentCertificate },
                ].map((doc, index) => (
                    <div key={index} className="mb-4">
                        <label className="text-gray-700 font-semibold">{doc.label}</label>
                        <div className="relative w-full h-40 bg-white border border-gray-300 rounded-xl flex items-center justify-center shadow-md hover:bg-gray-100 transition">
                            {doc.state ? (
                                <img
                                    src={doc.state}
                                    alt={doc.label}
                                    className="w-full h-full object-contain rounded-md"
                                />
                            ) : (
                                <span className="text-gray-500 flex items-center">
                                    <FaUpload className="mr-2 text-gray-400" /> อัปโหลดไฟล์
                                </span>
                            )}
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleImageChange(e, doc.setState)}
                            />
                        </div>
                    </div>
                ))}

                {/* ปุ่มบันทึกข้อมูล */}
                <button
                    onClick={handleSave}
                    className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 text-white py-3 rounded-lg shadow-lg text-lg transition"
                >
                    บันทึกข้อมูล
                </button>
            </div>

        </div>
    );
};

export default EditTutorProfilePage;
