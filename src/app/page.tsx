'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function Home() {

  const { data: session, status } = useSession();
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status,router])

  console.log(session)
  console.log(status)

  return (
<div>Test</div>
  );
}
