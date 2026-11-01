import { useEffect } from "react";
import { Outlet } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import {
  PersonalDetailsProvider,
  usePersonalDetails,
} from "../context/PersonalDetailsContext";

function LayoutContent() {
  const { error } = usePersonalDetails();

  useEffect(() => {
    if (error) {
      toast.error("Couldn't load site details. Please refresh.", {
        id: "personal-details-error", // prevents duplicate toasts
      });
    }
  }, [error]);

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-right" />
      <Header />
      <div className="flex-1 overflow-y-auto min-h-0">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

function Layout() {
  return (
    <PersonalDetailsProvider>
      <LayoutContent />
    </PersonalDetailsProvider>
  );
}

export default Layout;