import CountUp from "react-countup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StackedChart } from "./_components/stackedChart";
import { GrowthChart } from "./_components/growthChart";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NoPermission from "@/components/common/noPermission";
import { auth } from "@/server/auth";
import CountUpWrapper from "./_components/countUpWrapper";
import PermissionProvider from "@/components/providers/permissionProvider";

const cardData = [
  {
    title: "Total Revenue",
    value: 45231.89,
    change: "+20.1% from last month",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Subscriptions",
    value: 2350,
    change: "+180.1% from last month",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Sales",
    value: 12234,
    change: "+19% from last month",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    title: "Active Now",
    value: 573,
    change: "+201 since last hour",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
];

export default async function AnalyticsDashboard() {
  const session = await auth();
  const perms = session?.user.perms!;

  return (
    <PermissionProvider permissions={["VIEW_ANALYTICS_DASHBOARD"]} userPermissions={perms}>
    <div className="flex flex-col min-h-screen w-full">
      <header className="bg-background border-b">
        <div className="flex space-x-4 container mx-auto px-4 py-4">
          <SidebarTrigger />
          <h1 className="text-xl">Analytics</h1>
        </div>
      </header>
      <main className="flex-grow bg-muted/40">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cardData.map((card, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {card.title === "Total Revenue" ? "$" : ""}
                    <CountUpWrapper value={card.value} decimals={0} />
                  </div>
                  <p className="text-xs text-muted-foreground">{card.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <StackedChart />
            <GrowthChart />
          </div>
        </div>
      </main>
    </div>
    </PermissionProvider>
  );
}
