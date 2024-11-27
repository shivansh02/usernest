import dynamic from "next/dynamic";
import { auth } from "@/server/auth";
import NoPermission from "@/components/common/noPermission";

const AdminDashboard = dynamic(() => import("@/app/dashboard/admin-dashboard/page"));
const UserDashboard = dynamic(() => import("@/app/dashboard/user-dashboard/page"));

export default async function DashboardPage() {
  const session = await auth();
  const perms = session?.user.perms!;

  if (!session) {
    return <div>You need to log in to access this page.</div>;
  }

  if (!perms.includes("VIEW_ADMIN_DASHBOARD") && !perms.includes("VIEW_USER_DASHBOARD")) {
    return <NoPermission />;
  }

  return perms.includes("VIEW_ADMIN_DASHBOARD") ? (
    <AdminDashboard />
  ) : (
    <UserDashboard />
  );
}
