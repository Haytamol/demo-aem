import { MRT_RowData, MRT_TableOptions } from "material-react-table";
import { Box, CircularProgress } from "@mui/material";

const tableFont = {
  fontSize: {
    xs: "12px",
    sm: "13px",
    md: "14px",
    lg: "15px",
    xl: "17px",
  },
  fontFamily: "Roboto",
};

export function defaultTableSettings<T extends MRT_RowData>(): Partial<
  MRT_TableOptions<T>
> {
  return {
    columnFilterDisplayMode: "popover",
    enableFacetedValues: true,
    enableEditing: true,
    editDisplayMode: "modal",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "",
      },
    },
    positionActionsColumn: "last",
    muiTableHeadCellProps: {
      sx: tableFont,
    },
    muiTableBodyCellProps: {
      sx: tableFont,
    },
    renderEmptyRowsFallback: () => (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={5}
      >
        <CircularProgress />
      </Box>
    ),
  };
}
