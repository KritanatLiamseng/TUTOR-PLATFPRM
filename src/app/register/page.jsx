"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaLock } from "react-icons/fa";

export default function Register() {
  const router = useRouter();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role, isTutor) => {
    setFormData((prev) => ({ ...prev, role, isTutor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, surname, email, phone, username, password } = formData;
    if (!name || !surname || !email || !phone || !username || !password) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
        return;
      }

      alert("สมัครสมาชิกสำเร็จ! กำลังนำไปสู่หน้าเข้าสู่ระบบ...");
      router.push("/login");
    } catch (err) {
      console.error("Frontend Error:", err.message);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* ซ้าย: แนะนำ */}
        <div className="p-10 flex flex-col justify-center text-gray-800">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">สร้างบัญชีของคุณ</h1>
          <p className="text-lg mb-2">
            สมัครใช้งานแพลตฟอร์มหาติวเตอร์เพื่อพัฒนาการเรียนของคุณได้ดีขึ้น
          </p>
          <p className="text-sm text-gray-700">
            สำหรับผู้เรียนและติวเตอร์ ระบบค้นหาและจัดการใช้งานง่ายนิดเดียว ✨
          </p>
        </div>

        {/* ขวา: ฟอร์ม ไม่มี bg-white แล้ว */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <Image src="/logo.webp" alt="Logo" width={60} height={60} />
          </div>

          <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">สมัครสมาชิก</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "surname", "email", "phone", "username", "password"].map((field) => (
              <div key={field} className="relative">
                {field === "password" ? (
                  <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                ) : (
                  <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                )}
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}

            <div className="flex gap-2">
              {["student", "tutor"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role, role === "tutor")}
                  className={`flex-1 py-2 rounded-full font-medium transition ${
                    formData.role === role
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-blue-600 hover:bg-gray-300"
                  }`}
                >
                  {role === "student" ? "ผู้เรียน" : "ติวเตอร์"}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition"
            >
              สมัครสมาชิก
            </button>
          </form>

          <p className="text-sm text-center text-gray-700 mt-6">
            มีบัญชีแล้ว?{" "}
            <Link href="/login" className="text-blue-500 font-medium hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}