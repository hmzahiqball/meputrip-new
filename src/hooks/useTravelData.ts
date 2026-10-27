import { useEffect, useState } from "react";
import { repository } from "../services/repository";
import type { TravelData } from "../types/travel";
export function useTravelData() {
  const [data, setData] = useState<TravelData | null>(null),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError("");
    repository
      .load(controller.signal)
      .then((d) => {
        if (!controller.signal.aborted) setData(d);
      })
      .catch((e: unknown) => {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "Data tidak dapat dimuat.");
      });
    return () => controller.abort();
  }, [attempt]);
  return { data, error, retry: () => setAttempt((a) => a + 1) };
}
