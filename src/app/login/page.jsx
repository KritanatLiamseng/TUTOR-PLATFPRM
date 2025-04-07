"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("authToken", data.token);
        router.push(data.role === "tutor" ? "/hometutor" : "/home");
      } else {
        alert(data.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-10 py-16 text-gray-800">
          <h1 className="text-4xl font-bold mb-4">ยินดีต้อนรับกลับ!</h1>
          <p className="text-lg mb-2">
            เข้าสู่ระบบเพื่อเริ่มต้นการเรียนรู้กับติวเตอร์ที่ดีที่สุดของคุณ
          </p>
          <p className="text-sm text-gray-600">
            พร้อมระบบค้นหา จองเวลาเรียน และการรีวิวจากผู้ใช้งานจริง
          </p>
        </div>

        <div className="flex flex-col justify-center px-10 py-16">
          <div className="mb-6 text-center">
            <Image src="/logo.webp" alt="Logo" width={60} height={60} className="mx-auto" />
            <h2 className="text-2xl font-bold mt-4">เข้าสู่ระบบ</h2>
            <p className="text-gray-500 mt-2">ใช้อีเมลและรหัสผ่านที่คุณลงทะเบียนไว้</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition"
            >
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="text-blue-500 font-medium hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
