"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthContextProps {
  children: React.ReactNode;
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  console.log("🔑 Session:", session ? "Exists ✅" : "Missing ❌");
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = pathname === "/";

  useEffect(() => {
    if (!isPublicRoute && status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, isPublicRoute]);

  if (!isPublicRoute && status === "loading") {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

const AuthContext = ({ children }: AuthContextProps) => {
  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
};

export default AuthContext;
