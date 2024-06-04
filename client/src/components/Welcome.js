import React, { useEffect, useState, useMemo } from "react";
import { LogoFirstBar, LogoSecondBar, LogoThirdBar } from "../assets";

import { useAuth } from "../contexts/AuthContext";

function Welcome() {
  const { authUser } = useAuth();
  const [hideWelcome, setHideWelcome] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);

  const userName = useMemo(() => {
    if (authUser) {
      return authUser?.tokens?.signInDetails?.loginId;
    }
    return 'Creator';
  }, [authUser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideWelcome(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hideWelcome) {
      const timer = setTimeout(() => {
        setAnimationEnded(true);
      }, 1000); // Slightly longer than the animation duration
      return () => clearTimeout(timer);
    }
  }, [hideWelcome]);

  return (
    <div className="flex flex-col items-center justify-center bg-background text-white min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <h1 className={`text-2xl md:text-4xl font-bold animate-slide-in-left ${animationEnded ? "opacity-100" : "opacity-0"}`}>Welcome, {userName}</h1>
        <p className={`text-md md:text-lg mt-2 animate-slide-in-left-delay-1 ${animationEnded ? "opacity-100" : "opacity-0"}`}>Craft Your Success, Beat By Beat</p>
        {/* <AppLogo className={`h-16 w-16 animate-slide-in-left-delay-2 ${animationEnded ? "opacity-100" : "opacity-0"}`} /> */}
        <div className="flex">
        <LogoFirstBar className={`animate-slide-in-left-delay-2 ${animationEnded ? "opacity-100" : "opacity-0"}`} />
        <LogoSecondBar className={`animate-slide-in-left-delay-3 ${animationEnded ? "opacity-100" : "opacity-0"}`} />
        <LogoThirdBar className={`animate-slide-in-left-delay-4 ${animationEnded ? "opacity-100" : "opacity-0"}`} />
        </div>
        {/* <div className={`flex flex-row items-center space-x-1 animate-slide-in-left-delay-2 ${animationEnded ? "opacity-100" : "opacity-0"}`}>
          <LogoFirstBar className="h-16 w-16" />
          <LogoSecondBar className="h-16 w-16" />
          <LogoThirdBar className="h-16 w-16" />
        </div> */}
      </div>
    </div>
  );
}

export default Welcome;
