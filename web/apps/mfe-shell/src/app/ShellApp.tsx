/* ------------------------------------------------------------------ */
/*  ShellApp — Clean entry point for the MFE shell application         */
/*                                                                     */
/*  All providers, layout, routing, and config are composed here.      */
/*  Business logic lives in dedicated modules under app/ and features/ */
/* ------------------------------------------------------------------ */

import React from "react";
import { AppProviders } from "./providers/AppProviders";
import { ShellLayout } from "./layout/ShellLayout";

const ShellApp: React.FC = () => {
  return (
    <AppProviders>
      <ShellLayout />
    </AppProviders>
  );
};

export default ShellApp;
