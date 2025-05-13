// src/app/wallet/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import { FaWallet, FaUniversity } from "react-icons/fa";

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState();
  const [wallet, setWallet] = useState({ balance: 0, pending: 0 });
  const [bankName, setBankName] = useState("");
  const [bankAccNo, setBankAccNo] = useState("");
  const [bankAccName, setBankAccName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return router.push("/login");

    (async () => {
      try {
        const [uRes, wRes] = await Promise.all([
          fetch(`/api/user/${uid}`),
          fetch(`/api/wallet?user_id=${uid}`),
        ]);
        if (!uRes.ok) throw new Error("โหลดผู้ใช้ล้มเหลว");
        if (!wRes.ok) throw new Error("โหลดกระเป๋าเงินล้มเหลว");
        const u = await uRes.json();
        const w = await wRes.json();
        setUser(u);
        setWallet(w);

        if (u.role === "tutor") {
          const tRes = await fetch(`/api/tutor/${uid}`);
          if (!tRes.ok) throw new Error("โหลดข้อมูลติวเตอร์ล้มเหลว");
          const t = await tRes.json();
          setBankName(t.bank_name || "");
          setBankAccNo(t.bank_account_number || "");
          setBankAccName(t.bank_account_name || "");
        }
      } catch (e) {
        alert("❌ " + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const saveBank = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/tutor/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bank_name: bankName,
          bank_account_number: bankAccNo,
          bank_account_name: bankAccName,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "ล้มเหลว");
      alert("✅ บันทึกบัญชีเรียบร้อย");
    } catch (e) {
      alert("❌ " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">⏳ กำลังโหลดข้อมูล…</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        dropdownItems={[ 
          { label: "หน้าหลัก", path: "/hometutor" },
          { label: "การจอง", path: "/booking-history-tutor" },
          { label: "นโยบาย", path: "/policy" },
          { label: "ศูนย์ช่วยเหลือ", path: "/support" },
          { label: "รายงาน", path: "/report" },
          {
            label: "ออกจากระบบ",
            onClick: () => {
              localStorage.removeItem("userId");
              localStorage.removeItem("role");
              router.push("/login");
            },
          },
        ]}
        user={user}
      />
      <main className="max-w-lg mx-auto p-6 bg-white rounded shadow space-y-6">
        
          

        {user.role === "tutor" && (
          <>
            <h2 className="text-lg font-semibold">บัญชีธนาคาร</h2>
            <input
              className="w-full border p-2"
              placeholder="ชื่อธนาคาร"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
            <input
              className="w-full border p-2"
              placeholder="เลขที่บัญชี"
              value={bankAccNo}
              onChange={(e) => setBankAccNo(e.target.value)}
            />
            <input
              className="w-full border p-2"
              placeholder="ชื่อบัญชี"
              value={bankAccName}
              onChange={(e) => setBankAccName(e.target.value)}
            />
            <button
              disabled={saving}
              onClick={saveBank}
              className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? "กำลังบันทึก…" : "บันทึกบัญชีธนาคาร"}
            </button>
          </>
        )}

        {user.role !== "tutor" && (
          <button
            onClick={() => router.push("/wallet/withdraw")}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ขอถอนเงิน
          </button>
        )}
      </main>
    </div>
  );
}
