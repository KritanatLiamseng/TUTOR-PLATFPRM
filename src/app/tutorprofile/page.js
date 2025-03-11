"use client";

import FooterBar from "@/app/components/Footerbar";
import { useRouter } from "next/navigation";

const TutorProfilePage = () => {
    const router = useRouter();

    const mockTutorData = {
        name: "คุณครูสมชาย สมมุติ",
        profileImage: "/default-profile.png",
        education: "ปริญญาตรี วิทยาศาสตร์การศึกษา",
        phone: "081-234-5678",
        email: "somchai@example.com",
        username: "somchai_tutor",
        educationHistory: "จบจากมหาวิทยาลัยวิทยาศาสตร์",
        documentIdCard: "/idcard.png",
        documentProfilePicture: "/profile.png",
        documentCertificate: "/cert.pdf",
    };

    const handleEditClick = () => {
        router.push("/tutorprofile/edittutor");
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-white">
            <div className="w-full max-w-md p-4">
                <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 bg-blue-300 rounded-full flex items-center justify-center mb-4">
                        <img
                            src={mockTutorData.profileImage}
                            alt="รูปโปรไฟล์"
                            className="w-full h-full object-cover rounded-full shadow-md"
                        />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{mockTutorData.name}</h1>
                </div>

                {[
                    { label: "ชื่อ", value: mockTutorData.name },
                    { label: "เบอร์โทร", value: mockTutorData.phone },
                    { label: "อีเมล์", value: mockTutorData.email },
                    { label: "ชื่อผู้ใช้", value: mockTutorData.username },
                    { label: "ประวัติการศึกษา", value: mockTutorData.educationHistory },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="w-full bg-blue-200 text-gray-700 py-3 px-4 rounded-full shadow-md mb-2 text-center"
                    >
                        <strong>{item.label}: </strong>{item.value}
                    </div>
                ))}

                <h2 className="text-xl font-semibold my-4">เอกสารที่เกี่ยวข้อง</h2>
                <div className="flex flex-col gap-4">
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-lg font-bold mb-2">บัตรประชาชน</h3>
                        <img
                            src={mockTutorData.documentIdCard}
                            alt="บัตรประชาชน"
                            className="w-full h-auto object-cover rounded-md"
                        />
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-lg font-bold mb-2">รูปถ่ายใบหน้า</h3>
                        <img
                            src={mockTutorData.documentProfilePicture}
                            alt="รูปถ่ายใบหน้า"
                            className="w-full h-auto object-cover rounded-md"
                        />
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-lg font-bold mb-2">เอกสารรับรองอื่น ๆ</h3>
                        <a
                            href={mockTutorData.documentCertificate}
                            target="_blank"
                            className="text-blue-500 hover:underline"
                        >
                            ดูเอกสารรับรอง (PDF)
                        </a>
                    </div>
                </div>

                <button
                    onClick={handleEditClick}
                    className="bg-blue-500 text-white py-3 px-6 rounded-full shadow-md w-full mt-6"
                >
                    แก้ไข
                </button>
            </div>
           
        </div>
    );
};

export default TutorProfilePage;
