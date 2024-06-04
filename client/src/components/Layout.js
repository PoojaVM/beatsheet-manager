// src/components/Layout.js
import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import AppBar from "./AppBar";
import Welcome from "./Welcome";

const Layout = ({ children }) => {
  const { loading, showWelcome, setShowWelcome, authUser } = useAuth();

  useEffect(() => {
    if (!loading && authUser && showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [loading, authUser, showWelcome, setShowWelcome]);

  return (
    <div className="bg-background min-h-screen max-w-screen-xl lg:max-w-screen-2xl mx-auto p-2">
      {showWelcome ? (
        <Welcome />
      ) : (
        <>
          <AppBar />
          <div
            className="pt-20 overflow-scroll"
            style={{ height: "calc(100vh - 80px)" }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
