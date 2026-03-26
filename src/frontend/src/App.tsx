import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AdminPanel from "./pages/AdminPanel";
import Portfolio from "./pages/Portfolio";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#admin" || hash.startsWith("#admin")) {
      setIsAdmin(true);
    }

    const handleHashChange = () => {
      const h = window.location.hash;
      if (h === "#admin" || h.startsWith("#admin")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      <Toaster position="top-right" richColors />
      {isAdmin ? (
        <AdminPanel
          onExit={() => {
            window.location.hash = "";
            setIsAdmin(false);
          }}
        />
      ) : (
        <Portfolio
          onNavigateAdmin={() => {
            window.location.hash = "admin";
            setIsAdmin(true);
          }}
        />
      )}
    </>
  );
}
