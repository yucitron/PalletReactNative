import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusIndicatorProps {
  label: string;
  status: "connected" | "disconnected" | "warning" | "error" | "idle";
  className?: string;
}

const StatusIndicator = ({
  label,
  status,
  className,
}: StatusIndicatorProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          color: "bg-green-500",
          text: "Connected",
          variant: "default" as const,
        };
      case "disconnected":
        return {
          color: "bg-red-500",
          text: "Disconnected",
          variant: "destructive" as const,
        };
      case "warning":
        return {
          color: "bg-yellow-500",
          text: "Warning",
          variant: "secondary" as const,
        };
      case "error":
        return {
          color: "bg-red-500",
          text: "Error",
          variant: "destructive" as const,
        };
      case "idle":
        return {
          color: "bg-gray-400",
          text: "Idle",
          variant: "secondary" as const,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="flex items-center space-x-2">
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            config.color,
            status === "connected" && "animate-pulse",
          )}
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    </div>
  );
};

export default StatusIndicator;
