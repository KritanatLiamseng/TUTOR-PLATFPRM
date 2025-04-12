"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaLock,
  FaUpload,
} from "react-icons/fa";

const EditProfile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          if (data.profile_image) setProfileImage(data.profile_image);
        });
    }
  }, []);

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const updatedProfile = {
      ...profile,
      profile_image: profileImage,
    };

    const res = await fetch(`/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    });

    if (res.ok) {
      router.push("/studentprofile");
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const profileFields = [
    {
      label: "ชื่อ",
      name: "name",
      placeholder: "กรอกชื่อของคุณ",
      icon: <FaUser className="text-sky-500 mr-3" />,
    },
    {
      label: "เบอร์โทร",
      name: "phone",
      placeholder: "กรอกเบอร์โทรศัพท์",
      icon: <FaPhone className="text-green-500 mr-3" />,
    },
    {
      label: "อีเมล์",
      name: "email",
      placeholder: "กรอกอีเมล์ของคุณ",
      icon: <FaEnvelope className="text-red-500 mr-3" />,
    },
    {
      label: "ชื่อผู้ใช้",
      name: "username",
      placeholder: "กรอกชื่อผู้ใช้ (Username)",
      icon: <FaIdCard className="text-purple-500 mr-3" />,
    },
    {
      label: "รหัสผ่าน",
      name: "password",
      placeholder: "กรอกรหัสผ่านของคุณ",
      icon: <FaLock className="text-gray-500 mr-3" />,
      type: "password",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white font-sans py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:flex md:gap-10 items-center">
        {/* Avatar */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-200 shadow-xl">
            <img
              src={profileImage || "/default-profile.png"}
              className="w-full h-full object-cover"
              alt="avatar"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer shadow hover:bg-blue-600">
              <FaUpload size={14} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 mt-6 md:mt-0 space-y-4">
          {profileFields.map((field, index) => (
            <div
              key={index}
              className="bg-blue-50 border border-blue-100 p-4 rounded-lg shadow-sm flex items-center"
            >
              {field.icon}
              <input
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={profile[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="flex-1 ml-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
          ))}

          <div className="text-right">
            <button
              onClick={handleSave}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm shadow-md"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;