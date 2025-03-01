import {  useEffect, useRef } from "react";

export default function useOutsideClick(
  handeler?: (e: Event) => void,
  listenCapturing = true,
  cooldown = 500
) : React.MutableRefObject<HTMLElement | null>{
  let abelToClick = 1;
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    function handelClick(e: Event) {
      if (ref.current && !ref.current.contains(e.target as Node) && abelToClick) {
        abelToClick = 0;
        handeler?.(e);
        setTimeout(() => {
          abelToClick = 1;
        }, cooldown);
      }
    }
    document.addEventListener("click", handelClick, listenCapturing);
    return () =>
      document.removeEventListener("click", handelClick, listenCapturing);
  }, [handeler, listenCapturing, abelToClick]);
  return ref;
}
