"use client";

import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaFileAlt,
  FaCheckCircle,
  FaShieldAlt,
  FaUndo,
} from "react-icons/fa";

export default function PolicyPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-6 px-4 font-sans">
      {/* Header */}
      <header className="relative w-full bg-white shadow-md px-6 py-4 rounded-xl mb-6 flex items-center justify-center">
  <button
    onClick={() => router.push("/home")}
    className="absolute left-4 text-blue-600 hover:text-blue-800 transition text-xl"
    aria-label="ย้อนกลับ"
  >
    <FaArrowLeft />
  </button>
  <h2 className="text-xl font-bold text-gray-800">📘 ข้อกำหนดการใช้งาน & นโยบาย</h2>
</header>


      <main className="max-w-3xl mx-auto space-y-8">
        {/* การใช้งานแพลตฟอร์ม */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-blue-700 flex items-center mb-3">
            <FaFileAlt className="mr-2" /> การใช้งานแพลตฟอร์ม
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Tutor Platform เป็นพื้นที่สำหรับการเรียนรู้ที่ปลอดภัยและโปร่งใสระหว่างนักเรียนและติวเตอร์
            โดยผู้ใช้งานต้องปฏิบัติตามข้อกำหนดต่อไปนี้:
          </p>
          <ul className="list-disc pl-6 mt-3 text-gray-600 space-y-1">
            <li>กรอกข้อมูลจริงในการสมัครสมาชิก</li>
            <li>ห้ามเผยแพร่เนื้อหาหรือกระทำการใด ๆ ที่ผิดกฎหมาย</li>
            <li>ติวเตอร์ต้องให้บริการอย่างมืออาชีพและสุภาพ</li>
            <li>หากมีการละเมิด ทางระบบมีสิทธิ์ระงับบัญชีทันที</li>
          </ul>
        </section>

        {/* ข้อกำหนดทั่วไป */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-green-600 flex items-center mb-3">
            <FaCheckCircle className="mr-2" /> ข้อกำหนดทั่วไป
          </h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>ผู้ใช้งานต้องมีอายุไม่ต่ำกว่า 13 ปีบริบูรณ์</li>
            <li>แพลตฟอร์มไม่รับผิดชอบการชำระเงินนอกระบบ</li>
            <li>ข้อมูลจะถูกเก็บภายใต้นโยบายความปลอดภัยของระบบ</li>
          </ul>
        </section>

        {/* ความเป็นส่วนตัวและความปลอดภัย */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-purple-600 flex items-center mb-3">
            <FaShieldAlt className="mr-2" /> ความเป็นส่วนตัว & ความปลอดภัย
          </h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>ข้อมูลของผู้ใช้งานจะไม่ถูกเผยแพร่แก่บุคคลภายนอก</li>
            <li>ธุรกรรมการชำระเงินได้รับการเข้ารหัสอย่างปลอดภัย</li>
            <li>ผู้ใช้งานสามารถขอลบข้อมูลส่วนตัวได้ตลอดเวลา</li>
          </ul>
        </section>

        {/* นโยบายการคืนเงิน */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-rose-600 flex items-center mb-3">
            <FaUndo className="mr-2" /> นโยบายการคืนเงิน
          </h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>สามารถขอคืนเงินเต็มจำนวนหากยกเลิกก่อนเริ่มเรียน</li>
            <li>หากเรียนไปแล้วไม่เกินครึ่งคอร์ส จะได้รับคืน 50%</li>
            <li>หากเรียนเกิน 50% จะไม่สามารถขอคืนเงินได้</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
