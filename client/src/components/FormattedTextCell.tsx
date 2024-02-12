import { Box, useTheme } from "@mui/material";
import { MRT_Cell, MRT_RowData } from "material-react-table";

interface Props<T extends MRT_RowData> {
  cell: MRT_Cell<T, unknown>;
  backgroundColor?: string;
  color?: string;
}

const FormattedTextCell = <T extends MRT_RowData>({
  cell,
  backgroundColor = "",
  color,
}: Props<T>) => {
  const theme = useTheme();

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
        width: "100%",
        p: "0.25rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {cell.getValue<string>()}
    </Box>
  );
};

export default FormattedTextCell;
