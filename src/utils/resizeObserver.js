import { useEffect, useRef } from "react";

export const useResizeObserver = (callback) => {
    const targetRef = useRef(null);
  
    useEffect(() => {
      const target = targetRef.current;
  
      if (!target) return;
  
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          callback(entry.contentRect, entry);
        }
      });
  
      resizeObserver.observe(target);
  
      return () => {
        resizeObserver.unobserve(target);
      };
    }, [callback]);
  
    return targetRef;
};