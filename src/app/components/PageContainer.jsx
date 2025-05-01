"use client";
import BackButton from "./BackButton";
import Header from "./header";

export default function PageContainer({ 
  title, 
  titleIcon: TitleIcon, 
  children, 
  menuItems,
  extraHeaderButtons 
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header dropdownItems={menuItems} />
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <BackButton className="text-gray-700 hover:text-gray-900">
            ย้อนกลับ
          </BackButton>
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            {TitleIcon && <TitleIcon className="text-blue-600" />} {title}
          </h1>
          {extraHeaderButtons}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
