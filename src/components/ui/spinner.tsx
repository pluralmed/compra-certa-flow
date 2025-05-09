import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  text?: string;
  showText?: boolean;
}

const Spinner = ({ 
  size = "md", 
  text = "Carregando", 
  showText = false, 
  className, 
  ...props 
}: SpinnerProps) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10"
  };

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
      {...props}
    >
      <Loader2 className={cn("animate-spin text-teal", sizeMap[size])} />
      {showText && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export { Spinner }; 