// import {useEffect, useState} from "react"
// import Image from "next/image";
// import Navbar from "@/components/navigation/navbar";
// import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
// import { ChevronDown } from "lucide-react"

// export default function Home() {

//   return (
//     <>
//       {/* <Navbar /> */}
//       {/* <Sidebar>
//         <SidebarHeader>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <SidebarMenuButton>
//                     Select Workspace
//                     <ChevronDown className="ml-auto" />
//                   </SidebarMenuButton>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
//                   <DropdownMenuItem>
//                     <span>Acme Inc</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <span>Acme Corp.</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarHeader>
//       </Sidebar> */}

//       <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//         <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//           <Image
//             className="dark:invert"
//             src="https://nextjs.org/icons/next.svg"
//             alt="Next.js logo"
//             width={180}
//             height={38}
//             priority
//           />
//           <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//             <li className="mb-2">
//               Get started by editing{" "}
//               <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
//                 app/page.tsx
//               </code>
//               .
//             </li>
//             <li>Save and see your changes instantly.</li>
//           </ol>

//           <div className="flex gap-4 items-center flex-col sm:flex-row">
//             <a
//               className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
//               href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <Image
//                 className="dark:invert"
//                 src="https://nextjs.org/icons/vercel.svg"
//                 alt="Vercel logomark"
//                 width={20}
//                 height={20}
//               />
//               Deploy now
//             </a>
//             <a
//               className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
//               href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Read our docs
//             </a>
//           </div>
//         </main>
//         <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//           <a
//             className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//             href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               aria-hidden
//               src="https://nextjs.org/icons/file.svg"
//               alt="File icon"
//               width={16}
//               height={16}
//             />
//             Learn
//           </a>
//           <a
//             className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//             href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               aria-hidden
//               src="https://nextjs.org/icons/window.svg"
//               alt="Window icon"
//               width={16}
//               height={16}
//             />
//             Examples
//           </a>
//           <a
//             className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//             href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               aria-hidden
//               src="https://nextjs.org/icons/globe.svg"
//               alt="Globe icon"
//               width={16}
//               height={16}
//             />
//             Go to nextjs.org →
//           </a>
//         </footer>
//       </div>
//     </>
//   );
// }


'use client'

import * as React from 'react'
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/ui/app-sidebar"
import useDashboardStore from '@/hooks/useDashboardStore'
import { getOrgs } from "@/server/actions/getOrgs"
import {useEffect } from 'react'


export default function CustomSidebar() {
  useEffect(()=> {
    const orgs = getOrgs()
    console.log("frontend orgs: ", orgs)
  }, [])
  
  const {organisationId, organisationName} = useDashboardStore()
  return (

      <div className="flex-1">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <h1 className="font-semibold">{organisationId}</h1>
        </header>
        <main className="flex-1 p-6">
          {/* Your main content goes here */}
          <p>Main content area</p>
        </main>
      </div>
    // </SidebarProvider>
  )
}

