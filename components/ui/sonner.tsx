"use client";

import { useTheme } from "next-themes";
import React from "react";
import { Toaster as SonnerToaster, type ToasterProps as SonnerToasterProps } from "sonner";

interface CustomToasterProps extends Partial<SonnerToasterProps> {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; // Match Sonner's expected positions
}

const Toaster = ({ position = "top-right", ...props }: CustomToasterProps): JSX.Element => {
  const { theme = "system" } = useTheme();

  // Ensure the theme is of the correct type or fallback to "system"
  const validatedTheme = ["system", "light", "dark"].includes(theme)
    ? (theme as "system" | "light" | "dark")
    : "system";

  return (
    <SonnerToaster
      position={position} // Use the correct position type
      theme={validatedTheme} // Use the validated theme here
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
