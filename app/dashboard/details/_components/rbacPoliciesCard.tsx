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

export async function RBACPoliciesCard() {
  const managerPerms = await GetAllPerms("cm3ionqef0001iddgkvufvs4r", "MANAGER");
  console.log("managerPerms: ", managerPerms);
  const userPerms = await GetAllPerms("cm3ionqef0001iddgkvufvs4r", "USER");
  return (
    <Card>
      <CardContent>
          <div className="flex flex-col justify-center space-y-4 pt-6">
            <div>
              <h3 className="text-md">Manager Permissions</h3>
              {managerPerms.map((perm) => (
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
              {userPerms.map((perm) => (
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
