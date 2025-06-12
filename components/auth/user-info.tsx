"use client";

import { useSession, signOut } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Mail, Calendar } from "lucide-react";

export function UserInfo() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <span className="animate-spin text-2xl">⏳</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{session.user.name || "Not set"}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Account Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(session.user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}