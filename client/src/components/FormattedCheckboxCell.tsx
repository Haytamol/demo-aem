import { Checkbox } from "@mui/material";
import { MRT_Cell, MRT_RowData } from "material-react-table";

interface Props<T extends MRT_RowData> {
  cell: MRT_Cell<T, unknown>;
}

const FormattedCheckboxCell = <T extends MRT_RowData>({ cell }: Props<T>) => {
  if (!cell.getValue<boolean>()) return null;
  return (
    <Checkbox
      checked={cell.getValue<boolean>()}
      color="success"
    />
  );
};

export default FormattedCheckboxCell;
