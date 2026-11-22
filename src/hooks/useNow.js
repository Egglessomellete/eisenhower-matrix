import { useEffect, useState } from "react";

// Returns the current Date and refreshes it every minute (for the "now" line).
export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(
    function () {
      const id = setInterval(() => setNow(new Date()), intervalMs);
      return () => clearInterval(id); // cleanup: stop the timer on unmount
    },
    [intervalMs],
  );

  return now;
}
