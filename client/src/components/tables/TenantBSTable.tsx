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
  propertyID: string; // to check if a property was selected
}

const TenantBSTable = ({ data, propertyID }: Props) => {
  const columns = useMemo<MRT_ColumnDef<TenantBalanceEntry>[]>(
    () => intializeTenantBalanceColumns(),
    []
  );

  const defaultSettings = defaultTableSettings<TenantBalanceEntry>({
    isBalanceSheet: true,
    propertyID,
  });

  const table = useMaterialReactTable({
    ...defaultSettings,
    columns,
    data,
  });

  return <MaterialReactTable table={table} />;
};

export default TenantBSTable;
