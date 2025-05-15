"use client";

import { useRouter } from "next/navigation";
import { FaHeadset, FaEnvelope, FaArrowLeft } from "react-icons/fa";

const SupportPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-white py-10 px-4 font-sans">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-md rounded-xl max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className="text-blue-600 hover:text-blue-800 transition"
        >
          <FaArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-800 text-center flex-1">
          🆘 ศูนย์ช่วยเหลือและช่องทางติดต่อ
        </h2>
        <div className="w-6" /> {/* Spacer */}
      </header>

      {/* Main Section */}
      <main className="mt-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phone Support */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center text-center hover:shadow-xl transition">
          <FaHeadset className="text-blue-500 text-5xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">ติดต่อทางโทรศัพท์</h3>
          <p className="text-sm text-gray-600 mt-2">
            หากคุณต้องการความช่วยเหลืออย่างเร่งด่วน สามารถโทรหาเราได้ทันทีในเวลาทำการ
          </p>
          <a
            href="tel:0812345678"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm shadow-sm"
          >
            📞 โทร: 096-870-7770
          </a>
        </div>

        {/* Email Support */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center text-center hover:shadow-xl transition">
          <FaEnvelope className="text-red-500 text-5xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">ส่งอีเมลสอบถาม</h3>
          <p className="text-sm text-gray-600 mt-2">
            หากคุณมีข้อสงสัยหรือต้องการแจ้งปัญหาเกี่ยวกับการใช้งาน สามารถส่งอีเมลถึงเราได้ตลอด 24 ชม.
          </p>
          <a
            href="mailto:support@tutorplatform.com"
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm shadow-sm"
          >
            📧 Kitta2545@gmail.com
          </a>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;