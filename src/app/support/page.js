"use client";
import { useRouter } from "next/navigation";
import FooterNav from "@/app/components/FooterNav";
import { FaHeadset, FaEnvelope, FaArrowLeft } from "react-icons/fa";

const SupportPage = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-400 to-white">
            
            {/* Header */}
            <header className="w-full flex items-center bg-white/30 backdrop-blur-lg shadow-md py-4 px-6 rounded-b-2xl">
                <button onClick={handleBack} className="text-gray-700 hover:text-gray-900 transition">
                    <FaArrowLeft className="text-2xl" />
                </button>
                <h2 className="flex-1 text-center text-2xl font-bold text-gray-800">
                    🆘 ศูนย์ช่วยเหลือ
                </h2>
            </header>

            {/* ส่วนหลัก */}
            <main className="flex-1 p-6 w-full max-w-lg mx-auto space-y-6">
                
                {/* โทรศัพท์ */}
                <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg flex flex-col items-center">
                    <FaHeadset className="text-6xl text-blue-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">โทรศัพท์</h3>
                    <p className="text-gray-600 text-center text-sm mt-2">
                        ติดต่อทีมงานของเราทางโทรศัพท์เพื่อขอความช่วยเหลือ
                    </p>
                    <a href="tel:0812345678" className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition">
                        โทรเลย
                    </a>
                </div>

                {/* อีเมล */}
                <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg flex flex-col items-center">
                    <FaEnvelope className="text-6xl text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">อีเมล</h3>
                    <p className="text-gray-600 text-center text-sm mt-2">
                        ส่งอีเมลถึงทีมงานเพื่อสอบถามข้อมูลหรือแจ้งปัญหา
                    </p>
                    <a href="mailto:support@tutorplatform.com" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition">
                        ส่งอีเมล
                    </a>
                </div>
            </main>

           
        </div>
    );
};

export default SupportPage;

