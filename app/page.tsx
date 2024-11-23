"use client"
import * as React from "react";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  const { data: session } = useSession()

  // if (!session?.user) {
  //   router.push("/auth/login");
  // } else router.push("/dashboard/org-details");
  if(session?.user) router.push("/dashboard/org-details");
  return <></>;
}
