import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { GetAllPerms } from "@/server/actions/getAllPerms";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/server/auth";

export async function RBACPoliciesCard() {
  const session = await auth();
  const user = session?.user;
  const orgId = user?.orgId!;
  const managerPerms = await GetAllPerms(orgId, "MANAGER");
  console.log("managerPerms: ", managerPerms);
  const userPerms = await GetAllPerms("cm3ionqef0001iddgkvufvs4r", "USER");
  return (
    <Card>
      <CardContent>
          <div className="flex flex-col justify-center space-y-4 pt-6">
            <div>
              <h3 className="text-md">Manager Permissions</h3>
              {managerPerms.map((perm: {id: string, name: string}) => (
                <Badge
                  key={perm.id}
                  className=" rounded-full px-2 mr-2"
                >
                  {perm.name}
                </Badge>
              ))}
            </div>
            <div>
              <h3 className="text-md">User Permissions</h3>
              {userPerms.map((perm: {id: string, name: string}) => (
                <Badge
                  key={perm.id}
                className=" rounded-full px-2 mr-2"
                >
                  {perm.name}
                </Badge>
              ))}
            </div>
          </div>
        <CardFooter>
            
        </CardFooter>
      </CardContent>
    </Card>
  );
}
