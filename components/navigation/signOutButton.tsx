"use client"
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";

export function SignOutButton() {
  const router = useRouter()
  function handleSignOut() {
    signOut();
    router.push("/auth/login");
  }
  return (
   <Button onClick={() => handleSignOut()} variant={"ghost"} className="w-full">Sign Out</Button>
  )
}