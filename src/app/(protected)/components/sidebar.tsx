"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Key,
  Shield,
  Settings,
  Trash2,
  Plus,
  FolderOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "All Passwords",
    href: "/passwords",
    icon: Key,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: FolderOpen,
  },
  {
    title: "Generator",
    href: "/generator",
    icon: Plus,
  },
  {
    title: "Trash",
    href: "/passwords/trash",
    icon: Trash2,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export function Sidebar({
  className,
  isOpen = false,
  onToggle,
  onClose,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleToggleCollapse = () => {
    if (isMobile && onToggle) {
      onToggle();
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "relative flex flex-col border-r bg-background z-50 transition-transform duration-300 ease-in-out",
          // Desktop styles
          "md:relative md:translate-x-0",
          !isMobile && (collapsed ? "w-16" : "w-64"),
          // Mobile styles
          isMobile && "fixed top-0 left-0 h-full w-64",
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!collapsed && !isMobile && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-semibold">SignSafe</span>
            </div>
          )}

          {isMobile && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-lg font-semibold">SignSafe</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )}

          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleCollapse}
              className="ml-auto"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed && !isMobile ? "px-2" : "px-3",
                      isActive
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        collapsed && !isMobile ? "mx-auto" : "mr-2"
                      )}
                    />
                    {(!collapsed || isMobile) && <span>{item.title}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}
