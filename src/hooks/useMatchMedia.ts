import { useEffect, useState } from "react";

export default function useMatchMedia(
  matchMaxMediaAt: number | null
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  // To check if the media matched
  const [isMatched, setIsMatched] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia(
      `(max-width: ${matchMaxMediaAt}px)`
    );

    // In Case where no media provided don't attach the listener
    let handleResize: () => void;
    if (matchMaxMediaAt !== null) {
      handleResize = () => {
        setIsMatched(mediaQuery.matches);
      };

      // Call in the start in case where media starts at point that is less than wanted media
      handleResize();

      mediaQuery.addEventListener("change", handleResize);
    }
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [matchMaxMediaAt]);

  return [isMatched, setIsMatched];
}
