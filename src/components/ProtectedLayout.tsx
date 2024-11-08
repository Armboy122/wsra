'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

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

  return <>{children}</>
}