import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { registerSW } from "virtual:pwa-register";

import { queryClient } from "@/api/query-client";
import { setupApiInterceptors } from "@/api/axios";
import { AuthProvider } from "@/features/auth/auth-context";
import App from "@/App";
import "./index.css";

setupApiInterceptors();

registerSW({
  onRegistered(r: ServiceWorkerRegistration | undefined) {
    if (r) {
      console.log("Service worker registered", r);
    }
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
