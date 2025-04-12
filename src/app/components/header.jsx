"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const Header = () => {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error("โหลดข้อมูลผู้ใช้ล้มเหลว", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow px-6 py-3 flex justify-between items-center relative z-20">
      <h1 className="text-xl font-bold text-green-700">🎓 Tutor Platform</h1>

      {user ? (
        <div className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="text-sm font-medium text-gray-700 hover:text-green-700"
          >
            👋 สวัสดี, {user.name}
          </button>
          {openMenu && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40">
              <Link href="/studentprofile" className="block px-4 py-2 hover:bg-green-50">โปรไฟล์ของฉัน</Link>
              <Link href="/studentsetting" className="block px-4 py-2 hover:bg-green-50">การตั้งค่า</Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50">ออกจากระบบ</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Link href="/login" className="text-sm text-green-600 hover:underline mr-4">เข้าสู่ระบบ</Link>
          <Link href="/register" className="text-sm text-green-600 hover:underline">สมัครสมาชิก</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
