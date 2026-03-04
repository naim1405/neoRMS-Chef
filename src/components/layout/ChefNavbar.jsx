import React, { useState, useEffect } from "react";
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
import { getRestaurant } from "../../services/order";

const navItems = [
  { label: "Orders Board", to: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", to: "/profile", icon: User },
];

function ChefNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [restaurantName, setRestaurantName] = useState("Chef Portal");
  const [logoLoading, setLogoLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const chefName =
    localStorage.getItem("chefName") ||
    localStorage.getItem("userName") ||
    "Chef";
  const avatarLetter = chefName.charAt(0).toUpperCase();

  // 🔥 Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔥 Fetch restaurant info
  useEffect(() => {
    const fetchRestaurant = async () => {
      const restaurantId = localStorage.getItem("restaurantId");
      if (!restaurantId) {
        setRestaurantName("Chef Portal");
        return;
      }
      try {
        const data = await getRestaurant(restaurantId);
        if (data?.name) setRestaurantName(data.name);
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
      } finally {
        setLogoLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  const isNavItemActive = (to) => location.pathname === to;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClasses = (isActive) =>
    [
      "group flex items-center gap-3 px-4 py-2 transition-colors",
      isActive
        ? "bg-white text-[#FF4D4F]"
        : "text-white hover:bg-[#FF7F7F] hover:text-white",
    ].join(" ");

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 flex-col bg-[#FF4D4F] text-white">
        <div className="flex flex-col border-b border-[#FF7F7F]/40 px-4 py-6">
          {/* Logo and Restaurant Name */}
          <div className="flex flex-col items-center justify-center text-center mb-4">
            {logoLoading ? (
              <div className="h-8 w-8 animate-pulse bg-white rounded-full mb-2" />
            ) : (
              <div className="mb-2" />
            )}
            <p className="text-lg font-semibold break-words">{restaurantName}</p>
            <p className="text-xs text-white/80 mt-1">Chef Portal</p>
          </div>

          {/* Time and Date Display */}
          <div className="flex flex-col items-center justify-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-2xl font-bold text-white tracking-tight">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </p>
            <p className="text-xs text-white/90 mt-1 font-medium">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavItemActive(item.to);
            return (
              <Link key={item.to} to={item.to} className={linkClasses(active)}>
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-[#FF4D4F]" : "text-white"}`} />
                <span className={active ? "text-[#FF4D4F]" : "text-white"}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#FF7F7F]/40">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-[#FF4D4F] font-semibold">
              {avatarLetter}
            </div>
            <span className="truncate text-sm">{chefName}</span>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-br from-[#FF4D4F] to-[#FF7F7F] text-white transform active:scale-95 active:opacity-80"
          >
            <User className="h-4 w-4" />
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-br from-[#FF4D4F] to-[#FF7F7F] text-white transform active:scale-95 active:opacity-80 mt-2"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className="md:hidden fixed top-2 left-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-white bg-white text-[#FF4D4F] hover:bg-[#FF7F7F]"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="border-r border-[#FF4D4F]">
            <SheetHeader>
              <SheetTitle>{restaurantName}</SheetTitle>
            </SheetHeader>

            <div className="mt-2 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isNavItemActive(item.to);
                return (
                  <SheetClose asChild key={item.to}>
                    <Link
                      to={item.to}
                      className={linkClasses(active)}
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-[#FF4D4F]" : "text-white"}`} />
                      <span className={active ? "text-[#FF4D4F]" : "text-white"}>{item.label}</span>
                    </Link>
                  </SheetClose>
                );
              })}
            </div>

            <div className="p-4 border-t border-[#FF7F7F]/40">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-[#FF4D4F] font-semibold">
                  {avatarLetter}
                </div>
                <span className="truncate text-sm">{chefName}</span>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-br from-[#FF4D4F] to-[#FF7F7F] text-white transform active:scale-95 active:opacity-80"
              >
                <User className="h-4 w-4" />
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-br from-[#FF4D4F] to-[#FF7F7F] text-white transform active:scale-95 active:opacity-80 mt-2"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default ChefNavbar;