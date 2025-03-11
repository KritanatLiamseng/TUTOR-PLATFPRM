"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  if (session) {
    router.push("/home");
    return <p className="text-center mt-10">กำลังเข้าสู่ระบบ...</p>;
  }

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

      if (res.ok) {
        const { role } = await res.json();
        setSuccessMessage("เข้าสู่ระบบสำเร็จ!");

        setTimeout(() => {
          router.push(role === "tutor" ? "/hometutor" : "/home");
        }, 1000);
      } else {
        const error = await res.json();
        alert(error.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-300 to-white relative">
      
      {/* วงกลมตกแต่งพื้นหลัง */}
      <div className="absolute w-96 h-96 bg-white opacity-20 rounded-full top-20 left-10 blur-3xl"></div>
      <div className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full bottom-20 right-10 blur-3xl"></div>

      {/* กล่อง Login แบบ Glassmorphism */}
      <div className="w-full max-w-md p-8 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg">
        
        {/* โลโก้แพลตฟอร์มแทนไอคอนแม่กุญแจ */}
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
          เข้าสู่ระบบ
        </h2>
        <p className="text-gray-500 text-center mb-6">
          ใช้อีเมลและรหัสผ่านของคุณ หรือเข้าสู่ระบบด้วย Google
        </p>

        {/* ฟอร์ม Login */}
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <input
              type="text"
              name="username"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
          </div>

          {/* ลิงก์ลืมรหัสผ่าน */}
          <div className="text-right mb-4">
            <Link href="/forgot-password" className="text-blue-500 text-sm">
              ลืมรหัสผ่าน?
            </Link>
          </div>

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-80 transition mb-4"
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          {/* ปุ่มเข้าสู่ระบบด้วย Google */}
          <div className="flex justify-center items-center gap-4">
            <button
              type="button"
              onClick={() => signIn("google")}
              className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            >
              <img src="/icons8-google.svg" alt="Google" className="w-6 h-6" />
            </button>
          </div>

          {/* ปุ่มสมัครสมาชิก */}
          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">
              ยังไม่มีบัญชี?{" "}
            </span>
            <Link href="/register" className="text-blue-500 text-sm font-medium">
              สมัครสมาชิก
            </Link>
          </div>
        </form>
      </div>

      {successMessage && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition-all">
          {successMessage}
        </div>
      )}
    </div>
  );
}
