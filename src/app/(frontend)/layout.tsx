// app/(protected)/layout.tsx
import ProtectedLayout from "@/components/ProtectedLayout"
import Image from "next/image"
import Navbar from "./components/navbar"

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedLayout>
      <div className="container max-w-[1400px] mx-auto px-4 pt-4 bg-slate-100 min-h-screen">
        <div className="text-center  mb-1">
          <Image 
            src="/images/logo.png"
            alt="Student Affairs Wiangsa"
            width={1400}  // ปรับให้เท่ากับ container max-width
            height={467}  // ปรับตามสัดส่วนของรูป
            className="w-full h-auto 
              max-w-[900px] sm:max-w-[1100px] md:max-w-[1200px] lg:max-w-[1400px]
              rounded-xl shadow-lg mx-auto
              hover:shadow-xl transition-shadow duration-300"
            priority
          />
        </div>
        <Navbar />
        <div className="mt-6">
          {children}
        </div>
      </div>
    </ProtectedLayout>
  )
}