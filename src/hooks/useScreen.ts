import { useEffect, useState } from "react";

export function useScreen(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };

    updateMatches();

    mediaQuery.addEventListener("change", updateMatches);
    return () => {
      mediaQuery.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}
