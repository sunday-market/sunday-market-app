import { useEffect, useState } from "react";

export const useIsMobleScreen = () => {
  // this will adjust the screen size accordinly
  const [isNotMobile, setIsNotMobile] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleWindowResize() {
        setIsNotMobile(window.screen.width > 600);
      }
      // add window resize event
      window.addEventListener("resize", handleWindowResize);

      // call handle
      handleWindowResize();
    }
  }, []);

  return isNotMobile;
};
