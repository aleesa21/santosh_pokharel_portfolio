import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <section className="flex h-dvh w-full">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto pt-14 md:pt-0">
        <Outlet />
      </main>
    </section>
  );
}

export default AdminLayout;