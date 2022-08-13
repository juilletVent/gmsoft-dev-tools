import { useCallback } from "react";

export function useLinks() {
  const onProjectInfoOpen = useCallback(() => {
    window.open("https://github.com/juilletVent/gmsoft-dev-tools");
  }, []);
  const onAuthorInfoOpen = useCallback(() => {
    window.open("https://github.com/juilletVent");
  }, []);

  return { onProjectInfoOpen, onAuthorInfoOpen };
}
