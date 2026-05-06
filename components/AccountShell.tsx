"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Download, Package, Heart, Settings, LogOut, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";

const NAV = [
  { icon: Package, label: "Orders", href: "/account" },
  { icon: Download, label: "Downloads", href: "/account/downloads" },
  { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
  { icon: Star, label: "Reviews", href: "/account/reviews" },
  { icon: Settings, label: "Settings", href: "/account/settings" },
];

export default function AccountShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/account")}`);
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-16 text-sm text-neutral-500">
        Loading account…
      </div>
    );
  }

  async function onLogout() {
    await logout();
    toast.success("Signed out");
    router.push("/");
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-sm text-neutral-500 mt-1">Signed in as {user.email}</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-1 sticky top-28 self-start">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  active ? "bg-black text-white" : "hover:bg-neutral-100"
                }`}
              >
                <n.icon className="w-4 h-4" /> {n.label}
              </Link>
            );
          })}
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-neutral-100 w-full text-left text-rose-600"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
