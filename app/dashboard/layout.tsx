// import localFont from "next/font/local";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/navigation/app-sidebar";
// import { ThemeProvider } from "next-themes";
// import { Toaster } from "@/components/ui/toaster";
// import { SessionProvider } from "next-auth/react";

// export default function Layout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//                 <AppSidebar />
//           <main>
//                 {children}
//           </main>
//   );
// }

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar2";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <SidebarProvider>
    //   <main>
    //   <AppSidebar />
    //     {/* <SidebarTrigger /> */}
    //     {children}
    //   </main>
    // </SidebarProvider>
    <main>
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
          {children}
          <Toaster />
        </SidebarProvider>
      </ThemeProvider>
    </main>
  );
}
