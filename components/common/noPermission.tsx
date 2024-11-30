import { TriangleAlert } from "lucide-react";

export default function NoPermission() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <TriangleAlert size={64} className="text-muted-foreground" />
      <h1 className="text-xl text-muted-foreground mt-4">
        You do not have permission to view this page
      </h1>
    </div>
  );
}
