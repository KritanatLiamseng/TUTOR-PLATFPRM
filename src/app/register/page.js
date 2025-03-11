"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    role: "student",
    isTutor: false,
    bio: "",
    experienceYears: 0,
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role, isTutor) => {
    setFormData((prev) => ({ ...prev, role, isTutor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let errorData = { error: "Unknown error" };
        try {
          errorData = await res.json();
        } catch (e) {
          console.error("Failed to parse error response as JSON");
        }
        alert(errorData.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
        return;
      }

      alert("สมัครสมาชิกสำเร็จ! กำลังไปที่หน้าเข้าสู่ระบบ...");
      router.push("/login");
    } catch (error) {
      console.error("Frontend Error:", error.message);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-300 to-white relative">
      
      {/* วงกลมตกแต่งพื้นหลัง */}
      <div className="absolute w-96 h-96 bg-white opacity-20 rounded-full top-20 left-10 blur-3xl"></div>
      <div className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full bottom-20 right-10 blur-3xl"></div>

      {/* กล่อง Register แบบ Glassmorphism */}
      <div className="w-full max-w-md p-8 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg">
        
        {/* ปุ่มกลับไปหน้าก่อน */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition"
        >
          ⬅ 
        </button>

        {/* โลโก้ด้านบน */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.webp" // ต้องแน่ใจว่าไฟล์อยู่ใน public/
            alt="Tutor Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>

        {/* หัวข้อ */}
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-2">
          สมัครสมาชิก
        </h2>
        <p className="text-gray-500 text-center mb-6">
          กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีของคุณ
        </p>

        {/* ฟอร์ม Register */}
        <form onSubmit={handleSubmit}>
          
          {["name", "surname", "email", "phone", "username", "password"].map((field, index) => (
            <div className="mb-4" key={index}>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              />
            </div>
          ))}

          {/* ปุ่มเลือกบทบาท */}
          <div className="flex justify-between mb-6">
            {["student", "tutor"].map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => handleRoleChange(role, role === "tutor")}
                className={`px-6 py-2 rounded-lg text-lg ${
                  formData.role === role ? "bg-blue-500 text-white" : "bg-gray-200 text-blue-500"
                } transition`}
              >
                {role === "student" ? "ผู้เรียน" : "ติวเตอร์"}
              </button>
            ))}
          </div>

          {/* ปุ่มสมัครสมาชิก */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
          >
            สมัครสมาชิก
          </button>

          {/* ลิงก์ไปหน้าเข้าสู่ระบบ */}
          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">
              มีบัญชีแล้ว?{" "}
            </span>
            <Link href="/login" className="text-blue-500 text-sm font-medium">
              เข้าสู่ระบบ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
