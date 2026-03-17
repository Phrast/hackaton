"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Leaf } from "lucide-react";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (useAuth.persist.hasHydrated()) {
      router.replace(isAuthenticated ? "/sites" : "/login");
    } else {
      return useAuth.persist.onFinishHydration(() => {
        const authed = useAuth.getState().isAuthenticated;
        router.replace(authed ? "/sites" : "/login");
      });
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Leaf className="h-8 w-8 text-primary animate-pulse" />
    </div>
  );
}
