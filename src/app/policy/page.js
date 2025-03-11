"use client";
import { useRouter } from "next/navigation";
import FooterNav from "@/app/components/FooterNav";
import { FaArrowLeft, FaFileAlt, FaCheckCircle } from "react-icons/fa";

const PolicyPage = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-400 to-blue-100">
            
            {/* Header */}
            <header className="w-full flex items-center bg-white/30 backdrop-blur-lg shadow-md py-4 px-6 rounded-b-2xl">
                <button onClick={handleBack} className="text-gray-700 hover:text-gray-900 transition">
                    <FaArrowLeft className="text-2xl" />
                </button>
                <h2 className="flex-1 text-center text-2xl font-bold text-gray-800">
                    📄 นโยบายและข้อกำหนดการใช้งาน
                </h2>
            </header>

            {/* เนื้อหานโยบาย */}
            <main className="flex-1 p-6 max-w-3xl mx-auto space-y-6">
                <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-gray-800">
                    <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                        <FaFileAlt className="text-blue-500 mr-2" /> นโยบายการใช้งานแพลตฟอร์ม
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        Tutor Platform เป็นระบบที่ช่วยเชื่อมต่อผู้เรียนและติวเตอร์ 
                        เพื่อให้ได้รับประสบการณ์การเรียนรู้ที่ดีที่สุด นโยบายการใช้งานนี้ถูกจัดทำขึ้นเพื่อปกป้องผู้ใช้งานทุกคน 
                        กรุณาอ่านข้อกำหนดอย่างละเอียดก่อนใช้งานแพลตฟอร์มของเรา
                    </p>
                </div>

                {/* ข้อกำหนดการใช้งาน */}
                <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-gray-800">
                    <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" /> ข้อกำหนดการใช้งาน
                    </h3>
                    <ul className="text-gray-600 list-disc pl-6 space-y-2">
                        <li>ผู้ใช้งานต้องให้ข้อมูลที่ถูกต้องและเป็นจริงในการสมัครสมาชิก</li>
                        <li>ห้ามใช้แพลตฟอร์มในการกระทำที่ผิดกฎหมาย หรือขัดต่อศีลธรรม</li>
                        <li>ติวเตอร์ต้องมีคุณสมบัติที่เหมาะสมในการสอนวิชาที่ลงทะเบียนไว้</li>
                        <li>ห้ามใช้ภาษาหยาบคาย หรือทำการกลั่นแกล้ง (Harassment) ต่อผู้ใช้อื่น</li>
                        <li>การชำระเงินและธุรกรรมทุกอย่างต้องเป็นไปตามข้อกำหนดของระบบ</li>
                        <li>บริษัทขอสงวนสิทธิ์ในการระงับบัญชีที่ละเมิดกฎโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</li>
                    </ul>
                </div>

                {/* การคุ้มครองข้อมูลส่วนบุคคล */}
                <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-gray-800">
                    <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                        🔒 นโยบายความเป็นส่วนตัว
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ ข้อมูลของคุณจะถูกเก็บรักษาเป็นความลับ 
                        และใช้เพื่อการให้บริการภายในแพลตฟอร์มเท่านั้น
                    </p>
                    <ul className="text-gray-600 list-disc pl-6 space-y-2 mt-2">
                        <li>ข้อมูลส่วนบุคคลของคุณจะไม่ถูกเผยแพร่แก่บุคคลที่สามโดยไม่ได้รับอนุญาต</li>
                        <li>ข้อมูลการชำระเงินจะถูกเข้ารหัสและเก็บรักษาอย่างปลอดภัย</li>
                        <li>คุณสามารถร้องขอให้ลบข้อมูลของคุณได้ทุกเมื่อ</li>
                    </ul>
                </div>

                {/* การยกเลิกและการคืนเงิน */}
                <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-gray-800">
                    <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                        💰 นโยบายการยกเลิกและคืนเงิน
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        หากมีเหตุจำเป็นที่ทำให้คุณต้องยกเลิกการเรียนหรือต้องการคืนเงิน กรุณาตรวจสอบเงื่อนไขของเรา:
                    </p>
                    <ul className="text-gray-600 list-disc pl-6 space-y-2 mt-2">
                        <li>หากยกเลิกก่อนเริ่มคอร์สเรียน สามารถขอคืนเงินได้เต็มจำนวน</li>
                        <li>หากเรียนไปแล้ว 50% ของคอร์สเรียน จะสามารถขอคืนเงินได้ 50%</li>
                        <li>หากเรียนไปแล้วเกิน 50% จะไม่สามารถขอคืนเงินได้</li>
                    </ul>
                </div>

               
                
            </main>

            
        </div>
    );
};

export default PolicyPage;
