import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loader({ size = "md", className }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-muted-foreground/20 border-t-foreground",
          sizeClasses[size]
        )}
      />
    </div>
  );
}
