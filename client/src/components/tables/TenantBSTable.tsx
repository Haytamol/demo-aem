import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { TenantBalanceEntry } from "../../hooks/useTenantBalanceEntries";
import { intializeTenantBalanceColumns } from "../columns/tenantBalanceColumns";
import { defaultTableSettings } from "./tableSettings";

interface Props {
  data: TenantBalanceEntry[];
}

const TenantBSTable = ({ data }: Props) => {
  const columns = useMemo<MRT_ColumnDef<TenantBalanceEntry>[]>(
    () => intializeTenantBalanceColumns(),
    []
  );

  const defaultSettings = defaultTableSettings<TenantBalanceEntry>();

  const table = useMaterialReactTable({
    ...defaultSettings,
    columns,
    data,
  });

  return <MaterialReactTable table={table} />;
};

export default TenantBSTable;
