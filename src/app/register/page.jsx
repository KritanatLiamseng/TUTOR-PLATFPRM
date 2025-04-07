"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

export default function RegisterPage() {
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
      const res = await axios.post("/api/auth/register", formData);
      alert("สมัครสมาชิกสำเร็จ!");
      router.push("/login");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* ซ้าย - แนะนำระบบ */}
        <div className="bg-gradient-to-br from-cyan-200 to-blue-100 p-10 flex flex-col justify-center text-gray-800">
          <h1 className="text-4xl font-bold mb-4">สร้างบัญชีของคุณ</h1>
          <p className="text-lg mb-2">
            สมัครใช้งานแพลตฟอร์มหาติวเตอร์เพื่อพัฒนาการเรียนของคุณได้ดีขึ้น
          </p>
          <p className="text-sm text-gray-700">
            สำหรับผู้เรียนและติวเตอร์ ระบบค้นหาและจัดการใช้งานง่ายนิดเดียว ✨
          </p>
        </div>

        {/* ขวา - ฟอร์ม */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <Image src="/logo.webp" alt="Logo" width={60} height={60} />
          </div>

          <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
            สมัครสมาชิก
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", placeholder: "ชื่อ" },
              { name: "surname", placeholder: "นามสกุล" },
              { name: "email", placeholder: "อีเมล" },
              { name: "phone", placeholder: "เบอร์โทร" },
              { name: "username", placeholder: "ชื่อผู้ใช้" },
              { name: "password", placeholder: "รหัสผ่าน", type: "password" },
            ].map(({ name, placeholder, type = "text" }) => (
              <input
                key={name}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}

            {/* เลือกบทบาท */}
            <div className="flex gap-2">
              {[
                { label: "ผู้เรียน", value: "student" },
                { label: "ติวเตอร์", value: "tutor" },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRoleChange(value, value === "tutor")}
                  className={`flex-1 py-2 rounded-lg font-medium transition ${
                    formData.role === value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-blue-600 hover:bg-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* เฉพาะติวเตอร์ */}
            {formData.isTutor && (
              <>
                <textarea
                  name="bio"
                  placeholder="ประวัติสอนโดยย่อ"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  name="experienceYears"
                  placeholder="ประสบการณ์สอน (ปี)"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
            >
              สมัครสมาชิก
            </button>
          </form>

          <p className="text-sm text-center text-gray-700 mt-6">
            มีบัญชีแล้ว?{" "}
            <Link href="/login" className="text-blue-500 font-medium">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
