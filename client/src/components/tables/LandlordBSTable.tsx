import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { defaultTableSettings } from "./tableSettings";
import { LLBalanceEntry } from "../../hooks/useLLBalanceEntries";
import { intializeLLBalanceColumns } from "../columns/llBalanceColumns";

interface Props {
  data: LLBalanceEntry[];
  propertyID: string;
}

const LandlordBSTable = ({ data, propertyID }: Props) => {
  const columns = useMemo<MRT_ColumnDef<LLBalanceEntry>[]>(
    () => intializeLLBalanceColumns(),
    []
  );

  const defaultSettings = defaultTableSettings<LLBalanceEntry>({
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

export default LandlordBSTable;
