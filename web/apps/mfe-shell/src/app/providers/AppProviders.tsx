import React from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "@mfe/design-system";
import { store } from "../store/store";
import { ThemeProvider } from "../theme/theme-context.provider";
import { I18nProvider, i18n } from "../i18n";
import { queryClient, shouldShowQueryDevtools } from "../config/query-config";
import { AuthBootstrapper } from "./AuthBootstrapper";

// Side-effect imports — order matters
import "../config/http-config";
import "../config/shell-services-wiring";
import "../config/i18n-config";

/* ------------------------------------------------------------------ */
/*  AppProviders — Composes all shell-level providers                  */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    __shellStore?: typeof store;
  }
}

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    window.__shellStore = store;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <I18nProvider manager={i18n}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider
              position="top-right"
              duration={4500}
              maxVisible={4}
            >
              <AuthBootstrapper>
                {children}
              </AuthBootstrapper>
            </ToastProvider>
            {shouldShowQueryDevtools ? (
              <ReactQueryDevtools initialIsOpen={false} />
            ) : null}
          </QueryClientProvider>
        </I18nProvider>
      </ThemeProvider>
    </Provider>
  );
};
