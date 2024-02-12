import { Box, useTheme } from "@mui/material";
import { MRT_Cell, MRT_RowData } from "material-react-table";

interface Props<T extends MRT_RowData> {
  cell: MRT_Cell<T, unknown>;
  backgroundColor?: string;
  color?: string;
  zeroIsEmpty?: boolean;
}

const FormattedNumberCell = <T extends MRT_RowData>({
  cell,
  backgroundColor = "",
  color,
  zeroIsEmpty = false,
}: Props<T>) => {
  const theme = useTheme();

  //if we want to show nothing when the value is zero
  if (zeroIsEmpty && cell.getValue<number>() == 0) return null;

  return (
    <Box
      sx={{
        color: color
          ? color
          : theme.palette.mode === "dark"
          ? "white"
          : "black",
        backgroundColor: backgroundColor,
        borderRadius: "0.25rem",
        width: "70%",
        p: "0.25rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {cell.getValue<number>()?.toLocaleString?.("en-US", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}
    </Box>
  );
};

export default FormattedNumberCell;
