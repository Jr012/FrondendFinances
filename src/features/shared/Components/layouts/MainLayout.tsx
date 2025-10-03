import { Sidebar } from "./Sidebar";
import type { ReactNode } from "react";

import { useMediaQuery } from "@mui/material";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const isDesktop = useMediaQuery("(min-width:640px)"); 

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main
        className="flex-1 p-6 bg-gray-50 overflow-auto"
        style={{
          paddingTop: 64,
          paddingLeft: isDesktop ? 300 : 0,
          paddingRight: isDesktop ? 50 : 0,
        }}
      >
        {children}
      </main>
    </div>
  );
};

