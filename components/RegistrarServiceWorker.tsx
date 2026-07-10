"use client";

import { useEffect } from "react";

export default function RegistrarServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // registro falhou silenciosamente — não é crítico para o funcionamento do site
    });
  }, []);

  return null;
}
