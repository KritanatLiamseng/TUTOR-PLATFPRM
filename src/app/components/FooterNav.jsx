"use client";
import Link from 'next/link';
import { FaHome, FaBook, FaComments, FaUser } from 'react-icons/fa';

export default function FooterNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-100 to-blue-200 shadow-lg z-10">
      <div className="flex justify-around items-center py-2">
        
        <Link href="/home">
          <div className="flex flex-col items-center text-green-600 cursor-pointer">
            <FaHome className="text-2xl" />
            <span className="text-sm">Home</span>
          </div>
        </Link>

        <Link href="/booking">
          <div className="flex flex-col items-center text-gray-600 cursor-pointer">
            <FaBook className="text-2xl" />
            <span className="text-sm">การจอง</span>
          </div>
        </Link>

        <Link href="/chat">
          <div className="flex flex-col items-center text-blue-500 cursor-pointer">
            <FaComments className="text-2xl" />
            <span className="text-sm">แชท</span>
          </div>
        </Link>

        <Link href="/studentsetting">
          <div className="flex flex-col items-center text-blue-700 cursor-pointer">
            <FaUser className="text-2xl" />
            <span className="text-sm">การตั้งค่า</span>
          </div>
        </Link>
        
      </div>
    </nav>
  );
}
