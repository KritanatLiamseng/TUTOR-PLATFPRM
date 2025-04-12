"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft, FaFileAlt, FaCheckCircle, FaShieldAlt, FaUndo } from "react-icons/fa";

const PolicyPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-6 px-4 font-sans">
      {/* Header */}
      <header className="w-full flex items-center justify-between bg-white shadow-md px-6 py-4 rounded-xl mb-6">
        <button
          onClick={handleBack}
          className="text-blue-600 hover:text-blue-800 transition"
        >
         
        </button>
        <h2 className="text-xl font-bold text-gray-800 text-center w-full -ml-6">
          📘 ข้อกำหนดการใช้งาน & นโยบาย
        </h2>
        <div className="w-5" /> {/* Placeholder */}
      </header>

      <main className="max-w-3xl mx-auto space-y-8">
        {/* การใช้งานแพลตฟอร์ม */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-blue-700 flex items-center mb-3">
            <FaFileAlt className="mr-2" /> การใช้งานแพลตฟอร์ม
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Tutor Platform เป็นพื้นที่สำหรับการเรียนรู้ที่เชื่อมต่อระหว่างนักเรียนและติวเตอร์อย่างปลอดภัยและโปร่งใส
            กรุณาปฏิบัติตามแนวทางต่อไปนี้:
          </p>
          <ul className="list-disc pl-6 mt-3 text-gray-600 space-y-1">
            <li>กรอกข้อมูลจริงในแบบฟอร์มสมัครสมาชิก</li>
            <li>ห้ามเผยแพร่เนื้อหาหรือการกระทำที่ผิดกฎหมาย</li>
            <li>ติวเตอร์ควรให้บริการอย่างมืออาชีพ</li>
            <li>การใช้ถ้อยคำไม่เหมาะสมจะถูกดำเนินการตามขั้นตอน</li>
          </ul>
        </section>

        {/* ข้อกำหนดการใช้งาน */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-green-600 flex items-center mb-3">
            <FaCheckCircle className="mr-2" /> ข้อกำหนดทั่วไป
          </h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>ต้องมีอายุ 13 ปีขึ้นไปในการสมัคร</li>
            <li>แพลตฟอร์มไม่รับผิดชอบการโอนเงินนอกระบบ</li>
            <li>ข้อมูลทุกอย่างจะถูกจัดเก็บและตรวจสอบตามความจำเป็น</li>
          </ul>
        </section>

        {/* นโยบายความเป็นส่วนตัว */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-purple-600 flex items-center mb-3">
            <FaShieldAlt className="mr-2" /> ความเป็นส่วนตัว & ความปลอดภัย
          </h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>ข้อมูลส่วนตัวจะไม่ถูกเปิดเผยแก่บุคคลที่สาม</li>
            <li>ธุรกรรมการเงินได้รับการเข้ารหัสและป้องกัน</li>
            <li>คุณสามารถร้องขอให้ลบข้อมูลของคุณได้ตลอดเวลา</li>
          </ul>
        </section>

        {/* นโยบายคืนเงิน */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-rose-600 flex items-center mb-3">
            <FaUndo className="mr-2" /> นโยบายการคืนเงิน
          </h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>ขอคืนเงินได้เต็มจำนวนหากยกเลิกก่อนเริ่มเรียน</li>
            <li>ขอคืน 50% หากเรียนไปไม่เกินครึ่งหนึ่งของคอร์ส</li>
            <li>ไม่สามารถคืนเงินได้หากเรียนเกิน 50%</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default PolicyPage;