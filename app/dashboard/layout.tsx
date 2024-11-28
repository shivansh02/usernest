import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/appSidebar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
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
