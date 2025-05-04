
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook to scroll to top of the page on route change
 */
export function useScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" // Use "smooth" for smooth scrolling or "instant" for immediate jump
    });
  }, [pathname]);
}
