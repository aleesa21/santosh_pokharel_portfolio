import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <section className="flex  w-full h-screen">
      <Sidebar />
      <Outlet />
    </section>
  );
}

export default AdminLayout;
