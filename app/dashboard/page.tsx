"use client";

import { useSession } from "@/lib/auth/auth-client";
import { UserInfo } from "@/components/auth/user-info";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-spin text-4xl">⏳</span>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name || session.user.email}!
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <UserInfo />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Authentication Details</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Session ID:</span>
                <p className="text-muted-foreground break-all">{session.session.id}</p>
              </div>
              <div>
                <span className="font-medium">Expires At:</span>
                <p className="text-muted-foreground">
                  {new Date(session.session.expiresAt).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="font-medium">User ID:</span>
                <p className="text-muted-foreground">{session.user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}