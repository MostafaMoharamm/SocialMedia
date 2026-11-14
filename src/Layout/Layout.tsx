import Navbar from "./../Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      <Navbar />

      <main className="flex-1 w-full px-3 sm:px-4 pb-10">
        <Outlet />
      </main>
    </div>
  );
}