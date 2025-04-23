import { useEffect } from "react";

export function useKeypress(
  keys: string[],
  handler: (ev: KeyboardEvent) => void,
) {
  useEffect(() => {
    const eventListener = (ev: KeyboardEvent) => {
      if (keys.includes(ev.key)) {
        handler(ev);
      }
    };
    document.addEventListener("keydown", eventListener);
    return () => {
      document.removeEventListener("keydown", eventListener);
    };
  }, [keys, handler]);
}
