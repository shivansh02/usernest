import NoPermission from "@/components/common/noPermission";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/server/auth";
import AdminDashboard from "@/app/dashboard/admin-dashboard/page";
import UserDashboard from "@/app/dashboard/user-dashboard/page";



export default async function DashboardPage() {
  const session = await auth();
  const perms = session?.user.perms!;

  if (!session?.user.orgId) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Card className="p-8">
          <CardContent>
            Select an organisation in sidebar to view this page.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (
    !perms.includes("VIEW_ADMIN_DASHBOARD") &&
    !perms.includes("VIEW_USER_DASHBOARD")
  ) {
    return <NoPermission />;
  }

  return perms.includes("VIEW_ADMIN_DASHBOARD") ? (
    <AdminDashboard />
  ) : (
    <UserDashboard />
  );
}
