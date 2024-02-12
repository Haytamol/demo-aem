import { MRT_RowData, MRT_TableOptions } from "material-react-table";
import { Box, CircularProgress, Typography } from "@mui/material";

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

interface Props {
  isBalanceSheet?: boolean;
  propertyID?: string;
}

export function defaultTableSettings<T extends MRT_RowData>({
  isBalanceSheet = false,
  propertyID = "",
}: Props = {}): Partial<MRT_TableOptions<T>> {
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
        justifyContent="flex-start"
        alignItems="center"
        padding={5}
      >
        {isBalanceSheet && propertyID == "" ? (
          <Typography>Please select a property from the dropdown...</Typography>
        ) : propertyID != "" ? (
          <Typography>This property has no entries yet.</Typography>
        ) : (
          <CircularProgress />
        )}
      </Box>
    ),
  };
}
