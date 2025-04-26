"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ children }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-sm text-blue-600 hover:underline mb-4 flex items-center gap-1"
    >
      ← {children}
    </button>
  );
}
