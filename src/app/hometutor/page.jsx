"use client";

import FooterBar from "@/app/components/Footerbar";

const HomeTutorPage = () => {

    const tutorData = {
        name: "สมชาย ติวเตอร์",
        education: "ปริญญาตรี วิทยาศาสตร์การศึกษา",
        experience: "ประสบการณ์สอนมากกว่า 5 ปี",
        availability: "จันทร์-ศุกร์ เวลา 10.00-17.00 น.",
        rate_per_hour: "500 บาท/ชั่วโมง",
        profile_image: "/default-profile.png"
    };

    const courses = [
        {
            course_name: "คอร์สคณิตศาสตร์พื้นฐาน",
            subject: "คณิตศาสตร์",
            description: "เรียนรู้พื้นฐานคณิตศาสตร์ ม.ต้น เพื่อเตรียมสอบเข้าม.ปลาย",
            rate_per_hour: "500 บาท",
            total_hours: "10 ชั่วโมง",
            status: "เปิดรับสมัคร"
        },
        {
            course_name: "คอร์สฟิสิกส์เบื้องต้น",
            subject: "ฟิสิกส์",
            description: "เตรียมความพร้อมสำหรับการสอบเข้ามหาวิทยาลัย",
            rate_per_hour: "600 บาท",
            total_hours: "8 ชั่วโมง",
            status: "กำลังดำเนินการ"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50">
            <div className="w-full max-w-4xl p-4">
                
                {/* ส่วนข้อมูลติวเตอร์ */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <div className="w-24 h-24 bg-blue-300 rounded-full overflow-hidden flex items-center justify-center mr-4">
                            <img
                                src={tutorData.profile_image}
                                alt="รูปติวเตอร์"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{tutorData.name}</h2>
                            <p className="text-gray-600">ติวเตอร์</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><strong>วุฒิการศึกษา:</strong> {tutorData.education}</div>
                        <div><strong>ประสบการณ์:</strong> {tutorData.experience}</div>
                        <div><strong>ความพร้อมของตารางเวลา:</strong> {tutorData.availability}</div>
                        <div><strong>อัตราค่าบริการ:</strong> {tutorData.rate_per_hour}</div>
                    </div>
                </div>

                {/* ส่วนคอร์สที่เปิดสอน */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">คอร์สที่เปิดสอน</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold">{course.course_name}</h3>
                                <p><strong>วิชา:</strong> {course.subject}</p>
                                <p><strong>รายละเอียด:</strong> {course.description}</p>
                                <p><strong>ราคา:</strong> {course.rate_per_hour}</p>
                                <p><strong>ระยะเวลา:</strong> {course.total_hours}</p>
                                <p><strong>สถานะ:</strong> {course.status}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <FooterBar />
        </div>
    );
};

export default HomeTutorPage;
