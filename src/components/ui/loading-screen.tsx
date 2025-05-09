import React from "react";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

interface LoadingScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  spinnerSize?: "sm" | "md" | "lg";
  text?: string;
  showText?: boolean;
  fullScreen?: boolean;
}

const LoadingScreen = ({ 
  spinnerSize = "lg", 
  text = "Carregando", 
  showText = false, 
  fullScreen = true,
  className, 
  ...props 
}: LoadingScreenProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-center bg-background/80",
        fullScreen ? "fixed inset-0 z-50" : "w-full h-full min-h-[200px]",
        className
      )}
      {...props}
    >
      <Spinner size={spinnerSize} text={text} showText={showText} />
    </div>
  );
};

export { LoadingScreen }; 