import { Skeleton } from "@/components/ui/skeleton";
const LoadingPage = () => {
  return <div className="flex flex-col space-y-8 p-6">
    <Skeleton className="h-20" />
    <Skeleton className="h-20" />
    <Skeleton className="h-40" />
  </div>;
};

export default LoadingPage;
