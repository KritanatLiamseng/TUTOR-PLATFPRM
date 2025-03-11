import FooterNav from "@/app/components/FooterNav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-3xl font-bold">หน้าแรก (Home)</h1>
      </main>
      
      <FooterNav />
      
    </div>
  );
}
