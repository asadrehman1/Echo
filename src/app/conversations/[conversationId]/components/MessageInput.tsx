"use client";

import {  FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
}
const MessageInput = ({
  placeholder,
  id,
  required,
  type = "text",
  register,
}: MessageInputProps) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full 
        focus:outline-none border-none"
      />
    </div>
  );
};

export default MessageInput;
