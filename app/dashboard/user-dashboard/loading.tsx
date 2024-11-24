import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
  <div className="flex flex-col space-y-10">
    <Skeleton className="h-60" />
    <Skeleton className="h-60" />
    <Skeleton className="h-60" />
  </div>
  )
}
