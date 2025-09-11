"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div>
      <p>Welcome, {session?.user?.name}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
