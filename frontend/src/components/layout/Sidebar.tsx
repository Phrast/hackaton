"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Leaf, LayoutDashboard, Building2, GitCompare,
  LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/sites", icon: Building2, label: "Sites" },
  { href: "/compare", icon: GitCompare, label: "Comparer" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "glass border-r border-border flex flex-col h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 p-4", collapsed && "justify-center")}>
        <div className="rounded-xl bg-primary/20 p-2 border border-primary/30 shrink-0">
          <Leaf className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-sm leading-tight">CarbonTrack</p>
            <p className="text-[10px] text-muted-foreground">Empreinte Carbone</p>
          </div>
        )}
      </div>

      <Separator className="bg-border" />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-border" />

      {/* User + logout */}
      <div className="p-3 space-y-2">
        {!collapsed && user && (
          <div className="px-3 py-2 rounded-xl bg-muted text-xs">
            <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
            <p className="text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            collapsed ? "px-0 justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-2">Déconnexion</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full text-muted-foreground hover:bg-muted justify-center"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
