"use client"
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  
  return (
   <Button onClick={async()=> {await signOut()}} variant={"ghost"} className="w-full">Sign Out</Button>
  )
}