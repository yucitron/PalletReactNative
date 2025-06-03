import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ControlButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const ControlButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
  loading = false,
  className,
}: ControlButtonProps) => {
  return (
    <Button
      variant={variant}
      size="lg"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "flex flex-col items-center justify-center h-24 w-full space-y-2 text-sm font-medium",
        className,
      )}
    >
      <Icon className={cn("h-6 w-6", loading && "animate-spin")} />
      <span>{label}</span>
    </Button>
  );
};

export default ControlButton;
