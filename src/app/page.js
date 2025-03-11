"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      router.push("/home");
    }
  }, [router]);

  return <div className="text-center mt-10 text-lg font-bold">กำลังโหลด...</div>;
}
