import Image from "next/image";
import AuthForm from "./components/auth/AuthForm";

export default function Page() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-full py-12 sm:px-6 
    lg:px-8 bg-gray-100"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="mx-auto w-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  );
}
