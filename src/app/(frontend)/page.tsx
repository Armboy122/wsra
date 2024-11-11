'use client'
import { useSession} from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";
import BehaviorLogModal from "./components/BehaviorLog/BehaviorLogModal";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // ย้าย useState มาไว้ข้างบนพร้อมกับ hooks อื่นๆ
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("session", session)
  console.log("status", status)

  useEffect(() => {
    if (status === "unauthenticated" || !session) {
      router.push("/login")
    }
  }, [status, session, router])

  // รอจนกว่า status จะพร้อม
  if (status === "loading") {
    return <div>Loading...</div>
  }

  // แสดงเนื้อหาเฉพาะเมื่อมี session เท่านั้น
  if (!session) {
    return null
  }

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        บันทึกพฤติกรรม
      </Button>

      <BehaviorLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Toaster position="top-right" />
      <div>Test {session.user.name}</div>
      <div>Test {session.user.id}</div>
      <div>Test {session.user.role}</div>
    </div>
  );
}