"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentProfile() {
  const [user, setUser] = useState(null);

  // สมมุติว่าได้ userId มาจาก localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("โหลดข้อมูลผู้ใช้ล้มเหลว:", err);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (!user) return <div>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">โปรไฟล์ของคุณ</h1>
      <p><strong>ชื่อ:</strong> {user.name} {user.surname}</p>
      <p><strong>อีเมล:</strong> {user.email}</p>
      <p><strong>บทบาท:</strong> {user.role === "tutor" ? "ติวเตอร์" : "ผู้เรียน"}</p>
    </div>
  );
}
