import { useState, useEffect } from "react";

function useWindowWidth() {
   const [width, setWidth] = useState(window.innerWidth);
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

   useEffect(() => {
      const handleResize = () => {
         setWidth(window.innerWidth);
         setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   return isMobile;
}

export default useWindowWidth;
