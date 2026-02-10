"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "lg" | "md";
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium py-2 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white",
    secondary: "bg-black hover:bg-gray-800 text-white",
    outline: "border-2 border-black hover:bg-black hover:text-white text-black",
    ghost: "hover:bg-gray-100 text-gray-900",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
