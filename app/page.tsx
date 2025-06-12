"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { UserInfo } from "@/components/auth/user-info";
import { useSession } from "@/lib/auth/auth-client";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-spin text-4xl">⏳</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <main className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Better Auth + Fluree</h1>
          <p className="text-muted-foreground">
            Authentication demo with custom Fluree adapter
          </p>
        </div>
        
        {session?.user ? (
          <UserInfo />
        ) : (
          <AuthForm />
        )}
      </main>
    </div>
  );
}
