'use client'
import { useSession} from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter()

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
      <div>Test {session.user.name}</div>
      <div>Test {session.user.id}</div>
      <div>Test {session.user.role}</div>
    </div>
  );
}