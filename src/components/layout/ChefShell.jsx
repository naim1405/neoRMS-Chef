import React from "react";
import { Outlet } from "react-router-dom";
import ChefNavbar from "./ChefNavbar.jsx";

export default function ChefShell() {
  return (
    <div className="flex min-h-screen">
      <ChefNavbar />
      <main className="flex-1 pt-16 md:pt-0 md:pl-64">
        <Outlet />
      </main>
    </div>
  );
}
