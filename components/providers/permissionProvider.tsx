import { CheckPermissions } from "@/lib/checkPermission";
import NoPermission from "../common/noPermission";

interface PermissionProviderProps {
  permissions: string[];
  userPermissions: string[];
  children: React.ReactNode;
}

const PermissionProvider = ({
  permissions,
  userPermissions,
  children,
}: PermissionProviderProps) => {
  const isAllowed = CheckPermissions(permissions, userPermissions);

  return <div className="min-h-screen w-full">{isAllowed ? children : <NoPermission/>}</div>;
};

export default PermissionProvider;
