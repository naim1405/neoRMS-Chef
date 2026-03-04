import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, LogOut, Menu } from "lucide-react";
import { Button } from "../ui-waiter/button.jsx";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "../ui-waiter/sheet.jsx";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Orders Board", to: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", to: "/profile", icon: User },
];

function ChefNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const chefName =
    localStorage.getItem("chefName") ||
    localStorage.getItem("userName") ||
    "Chef";
  const avatarLetter = chefName.charAt(0).toUpperCase();

  const isNavItemActive = (to) => location.pathname === to;

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const SidebarContent = ({ useSheetClose = false }) => (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = isNavItemActive(item.to);
        const linkEl = (
          <Link
            key={item.to}
            to={item.to}
            className={[
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-[#C3110C] [&_svg]:text-[#C3110C] [&_span]:text-[#C3110C]"
                : "text-white hover:bg-[#E6501B] [&_svg]:text-white [&_span]:text-white",
            ].join(" ")}
          >
            <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#C3110C]" : "text-white"}`} />
            <span className={isActive ? "text-[#C3110C]" : "text-white"}>{item.label}</span>
          </Link>
        );
        return useSheetClose ? (
          <SheetClose asChild key={item.to}>
            {linkEl}
          </SheetClose>
        ) : (
          <div key={item.to}>{linkEl}</div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:z-40 bg-[#C3110C] shadow-md border-r border-[#C3110C]">
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-3 px-4 py-4 text-left w-full border-b border-white/20 !bg-transparent border-0 hover:!bg-transparent focus:!bg-transparent"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C3110C] overflow-hidden">
            <span className="text-[9px] font-extrabold tracking-tight text-white leading-none select-none text-center">
              neo
              <br />
              RMS
            </span>
          </div>
          <span className="text-sm font-semibold text-white">
            Chef Panel
          </span>
        </button>
        <SidebarContent useSheetClose={false} />
        <div className="mt-auto p-4 border-t border-white/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#C3110C]">
              {avatarLetter}
            </div>
            <span className="truncate text-sm text-white">{chefName}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg text-white hover:bg-[#E6501B] transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-40 h-16 bg-[#C3110C] shadow-md border-b border-[#C3110C] md:hidden">
        <div className="flex h-full items-center justify-between px-4">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-2 !bg-transparent border-0 hover:!bg-transparent focus:!bg-transparent"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#C3110C] overflow-hidden">
              <span className="text-[8px] font-extrabold text-white">
                neo
              </span>
            </div>
            <span className="text-sm font-semibold text-white">
              Chef Panel
            </span>
          </button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-white bg-white/10 text-white hover:bg-[#E6501B] hover:border-[#E6501B]"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="border-r border-[#C3110C] bg-[#C3110C] flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-white">Chef Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex-1">
                <SidebarContent useSheetClose />
              </div>
              <div className="pt-4 mt-auto border-t border-white/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#C3110C]">
                    {avatarLetter}
                  </div>
                  <span className="truncate text-sm text-white">{chefName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg text-white hover:bg-[#E6501B] transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}

export default ChefNavbar;
