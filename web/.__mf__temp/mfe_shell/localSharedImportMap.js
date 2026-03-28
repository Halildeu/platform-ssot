
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "@mfe/design-system": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild___mf_0_mfe_mf_1_design_mf_2_system__prebuild__.js");
            return pkg;
        }
      ,
        "@mfe/i18n-dicts": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild___mf_0_mfe_mf_1_i18n_mf_2_dicts__prebuild__.js");
            return pkg;
        }
      ,
        "@mfe/shared-http": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild___mf_0_mfe_mf_1_shared_mf_2_http__prebuild__.js");
            return pkg;
        }
      ,
        "@platform/capabilities": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild___mf_0_platform_mf_1_capabilities__prebuild__.js");
            return pkg;
        }
      ,
        "@reduxjs/toolkit": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild___mf_0_reduxjs_mf_1_toolkit__prebuild__.js");
            return pkg;
        }
      ,
        "@tanstack/react-query": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild___mf_0_tanstack_mf_1_react_mf_2_query__prebuild__.js");
            return pkg;
        }
      ,
        "ag-grid-community": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild__ag_mf_2_grid_mf_2_community__prebuild__.js");
            return pkg;
        }
      ,
        "ag-grid-enterprise": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild__ag_mf_2_grid_mf_2_enterprise__prebuild__.js");
            return pkg;
        }
      ,
        "ag-grid-react": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild__ag_mf_2_grid_mf_2_react__prebuild__.js");
            return pkg;
        }
      ,
        "clsx": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild__clsx__prebuild__.js");
            return pkg;
        }
      ,
        "react": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild__react__prebuild__.js");
            return pkg;
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild__react_mf_2_dom__prebuild__.js");
            return pkg;
        }
      ,
        "react-redux": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild__react_mf_2_redux__prebuild__.js");
            return pkg;
        }
      ,
        "react-router": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild__react_mf_2_router__prebuild__.js");
            return pkg;
        }
      ,
        "react-router-dom": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild__react_mf_2_router_mf_2_dom__prebuild__.js");
            return pkg;
        }
      ,
        "tailwind-merge": async () => {
          let pkg = await import("__mf__virtual/mfe_shell__prebuild__tailwind_mf_2_merge__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "@mfe/design-system": {
            name: "@mfe/design-system",
            version: "1.0.0",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"@mfe/design-system"}' must be provided by host`);
              }
              usedShared["@mfe/design-system"].loaded = true
              const {"@mfe/design-system": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@mfe/design-system" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^1.0.0",
              
            }
          }
        ,
          "@mfe/i18n-dicts": {
            name: "@mfe/i18n-dicts",
            version: "0.1.0",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"@mfe/i18n-dicts"}' must be provided by host`);
              }
              usedShared["@mfe/i18n-dicts"].loaded = true
              const {"@mfe/i18n-dicts": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@mfe/i18n-dicts" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^0.1.0",
              
            }
          }
        ,
          "@mfe/shared-http": {
            name: "@mfe/shared-http",
            version: "1.0.0",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"@mfe/shared-http"}' must be provided by host`);
              }
              usedShared["@mfe/shared-http"].loaded = true
              const {"@mfe/shared-http": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@mfe/shared-http" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^1.0.0",
              
            }
          }
        ,
          "@platform/capabilities": {
            name: "@platform/capabilities",
            version: "1.0.0",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"@platform/capabilities"}' must be provided by host`);
              }
              usedShared["@platform/capabilities"].loaded = true
              const {"@platform/capabilities": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@platform/capabilities" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^1.0.0",
              
            }
          }
        ,
          "@reduxjs/toolkit": {
            name: "@reduxjs/toolkit",
            version: "2.8.2",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"@reduxjs/toolkit"}' must be provided by host`);
              }
              usedShared["@reduxjs/toolkit"].loaded = true
              const {"@reduxjs/toolkit": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@reduxjs/toolkit" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^2.8.2",
              
            }
          }
        ,
          "@tanstack/react-query": {
            name: "@tanstack/react-query",
            version: "5.90.10",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"@tanstack/react-query"}' must be provided by host`);
              }
              usedShared["@tanstack/react-query"].loaded = true
              const {"@tanstack/react-query": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "@tanstack/react-query" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^5.90.10",
              
            }
          }
        ,
          "ag-grid-community": {
            name: "ag-grid-community",
            version: "34.3.1",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"ag-grid-community"}' must be provided by host`);
              }
              usedShared["ag-grid-community"].loaded = true
              const {"ag-grid-community": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "ag-grid-community" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "34.3.1",
              
            }
          }
        ,
          "ag-grid-enterprise": {
            name: "ag-grid-enterprise",
            version: "34.3.1",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"ag-grid-enterprise"}' must be provided by host`);
              }
              usedShared["ag-grid-enterprise"].loaded = true
              const {"ag-grid-enterprise": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "ag-grid-enterprise" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "34.3.1",
              
            }
          }
        ,
          "ag-grid-react": {
            name: "ag-grid-react",
            version: "34.3.1",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"ag-grid-react"}' must be provided by host`);
              }
              usedShared["ag-grid-react"].loaded = true
              const {"ag-grid-react": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "ag-grid-react" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "34.3.1",
              
            }
          }
        ,
          "clsx": {
            name: "clsx",
            version: "2.1.1",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"clsx"}' must be provided by host`);
              }
              usedShared["clsx"].loaded = true
              const {"clsx": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "clsx" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^2.1.1",
              
            }
          }
        ,
          "react": {
            name: "react",
            version: "18.2.0",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"react"}' must be provided by host`);
              }
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "react" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "~18.2.0",
              
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "18.2.0",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"react-dom"}' must be provided by host`);
              }
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "react-dom" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "~18.2.0",
              
            }
          }
        ,
          "react-redux": {
            name: "react-redux",
            version: "9.2.0",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"react-redux"}' must be provided by host`);
              }
              usedShared["react-redux"].loaded = true
              const {"react-redux": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "react-redux" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^9.2.0",
              
            }
          }
        ,
          "react-router": {
            name: "react-router",
            version: "6.27.0",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"react-router"}' must be provided by host`);
              }
              usedShared["react-router"].loaded = true
              const {"react-router": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "react-router" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^6.27.0",
              
            }
          }
        ,
          "react-router-dom": {
            name: "react-router-dom",
            version: "6.27.0",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"react-router-dom"}' must be provided by host`);
              }
              usedShared["react-router-dom"].loaded = true
              const {"react-router-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "react-router-dom" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^6.27.0",
              
            }
          }
        ,
          "tailwind-merge": {
            name: "tailwind-merge",
            version: "3.3.1",
            scope: ["default"],
            loaded: false,
            from: "mfe_shell",
            async get () {
              if (false) {
                throw new Error(`[Module Federation] Shared module '${"tailwind-merge"}' must be provided by host`);
              }
              usedShared["tailwind-merge"].loaded = true
              const {"tailwind-merge": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "tailwind-merge" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^3.3.1",
              
            }
          }
        
    }
      const usedRemotes = [
                {
                  entryGlobalName: "mfe_reporting",
                  name: "mfe_reporting",
                  type: "module",
                  entry: "http://localhost:3007/remoteEntry.js",
                  shareScope: "default",
                }
          
      ]
      export {
        usedShared,
        usedRemotes
      }
      