import clsx from "clsx";
import React from "react";
interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  type = "button",
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        `
    flex
    items-center
    justify-center
    rounded-md
    border
    border-transparent
    px-4
    py-2
    text-sm
    font-medium
    shadow-sm
    text-white
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    focus:ring-sky-500
    `,
        secondary ? "text-gray-900" : "text-white",
        danger && "bg-rose-500 hover:bg-rose-600 focus:ring-rose-600",
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-default",
        !secondary &&
          !danger &&
          "bg-sky-500 hover:bg-sky-600 focus:ring-sky-600"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
