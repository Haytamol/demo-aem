import { Typography } from "@mui/material";
import { MRT_Cell, MRT_RowData } from "material-react-table";

interface Props<T extends MRT_RowData> {
  cell: MRT_Cell<T, unknown>;
}

const FormattedDateCell = <T extends MRT_RowData>({ cell }: Props<T>) => {
  if (cell.getValue() == "Invalid Date") return;
  return (
    <Typography>
      {cell.getValue<Date>().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}
    </Typography>
  );
};

export default FormattedDateCell;
