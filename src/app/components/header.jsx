"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error("โหลดข้อมูลผู้ใช้ล้มเหลว", err));
    }
  }, []);

  return (
    <header className="bg-white/70 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-700">🎓 Tutor Platform</h1>

      <div className="text-sm text-gray-700">
        {user ? (
          <span>👋 สวัสดี, <b>{user.name}</b></span>
        ) : (
          <>
            <Link href="/login" className="text-blue-500 hover:underline mr-4">
              เข้าสู่ระบบ
            </Link>
            <Link href="/register" className="text-blue-500 hover:underline">
              สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
