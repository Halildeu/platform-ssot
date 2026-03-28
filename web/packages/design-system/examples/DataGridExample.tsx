/**
 * Data Grid Example -- AG Grid integration via the design-system GridShell wrapper.
 *
 * Demonstrates basic client-side grid setup with GridShell and GridToolbar.
 */
import React, { useRef, useState } from "react";

import {
  GridShell,
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Select,
  DesignSystemProvider,
} from "@mfe/design-system";
import type { GridShellApi } from "@mfe/design-system";
import type { ColDef } from "ag-grid-community";

/* ------------------------------------------------------------------ */
/*  Sample data                                                        */
/* ------------------------------------------------------------------ */

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "inactive" | "on-leave";
  startDate: string;
  salary: number;
}

const SAMPLE_DATA: Employee[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", department: "Engineering", role: "Senior Developer", status: "active", startDate: "2021-03-15", salary: 120000 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", department: "Design", role: "UI Designer", status: "active", startDate: "2022-01-10", salary: 95000 },
  { id: 3, name: "Carol Williams", email: "carol@example.com", department: "Engineering", role: "Tech Lead", status: "active", startDate: "2020-06-01", salary: 145000 },
  { id: 4, name: "David Brown", email: "david@example.com", department: "Product", role: "Product Manager", status: "on-leave", startDate: "2021-09-20", salary: 130000 },
  { id: 5, name: "Eve Davis", email: "eve@example.com", department: "Engineering", role: "Junior Developer", status: "active", startDate: "2023-02-14", salary: 75000 },
  { id: 6, name: "Frank Miller", email: "frank@example.com", department: "QA", role: "QA Engineer", status: "inactive", startDate: "2019-11-30", salary: 90000 },
  { id: 7, name: "Grace Wilson", email: "grace@example.com", department: "Design", role: "UX Researcher", status: "active", startDate: "2022-07-05", salary: 100000 },
  { id: 8, name: "Henry Taylor", email: "henry@example.com", department: "Engineering", role: "DevOps Engineer", status: "active", startDate: "2021-04-12", salary: 115000 },
];

/* ------------------------------------------------------------------ */
/*  Column definitions                                                 */
/* ------------------------------------------------------------------ */

const STATUS_VARIANT_MAP: Record<Employee["status"], "success" | "error" | "warning"> = {
  active: "success",
  inactive: "error",
  "on-leave": "warning",
};

const columnDefs: ColDef<Employee>[] = [
  { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
  { field: "department", headerName: "Department", width: 130 },
  { field: "role", headerName: "Role", flex: 1, minWidth: 150 },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    cellRenderer: (params: { value: Employee["status"] }) => {
      const variant = STATUS_VARIANT_MAP[params.value] ?? "default";
      return <Badge variant={variant}>{params.value}</Badge>;
    },
  },
  {
    field: "salary",
    headerName: "Salary",
    width: 120,
    valueFormatter: (params: { value: number }) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(params.value),
  },
  { field: "startDate", headerName: "Start Date", width: 130 },
];

const defaultColDef: ColDef<Employee> = {
  sortable: true,
  filter: true,
  resizable: true,
};

/* ------------------------------------------------------------------ */
/*  DataGridExample                                                    */
/* ------------------------------------------------------------------ */

export function DataGridExample() {
  const gridRef = useRef<GridShellApi<Employee>>(null);
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  const handleExportCsv = () => {
    const api = gridRef.current?.getGridApi();
    if (api) {
      api.exportDataAsCsv({ fileName: "employees.csv" });
    }
  };

  return (
    <DesignSystemProvider>
      <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          Data Grid Example
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          AG Grid integration via the GridShell wrapper component.
        </p>

        <Card variant="elevated" padding="none">
          <CardHeader
            title="Employee Directory"
            subtitle={`${SAMPLE_DATA.length} employees`}
            action={
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Select
                  options={[
                    { value: "comfortable", label: "Comfortable" },
                    { value: "compact", label: "Compact" },
                  ]}
                  value={density}
                  onChange={(e) => setDensity(e.target.value as "comfortable" | "compact")}
                  size="sm"
                  fullWidth={false}
                />
                <Button size="sm" variant="outline" onClick={handleExportCsv}>
                  Export CSV
                </Button>
              </div>
            }
          />
          <CardBody>
            <GridShell<Employee>
              ref={gridRef}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowData={SAMPLE_DATA}
              density={density}
              height={400}
              animateRows
            />
          </CardBody>
        </Card>
      </div>
    </DesignSystemProvider>
  );
}
