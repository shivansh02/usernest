"use client"
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";

export function SignOutButton() {
  const router = useRouter()
  
  return (
   <Button onClick={async()=> {await signOut()}} variant={"ghost"} className="w-full">Sign Out</Button>
  )
}