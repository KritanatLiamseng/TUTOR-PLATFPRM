"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckRolePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      if (!role) {
        console.warn("ไม่พบ role ของผู้ใช้");
        return;
      }

      if (role === "tutor") {
        router.replace("/hometutor");
      } else {
        router.replace("/home");
      }
    }
  }, [session, status, router]);

  return (
    <div className="text-center mt-10 text-gray-600">
      กำลังตรวจสอบบทบาทผู้ใช้งาน...
    </div>
  );
}
