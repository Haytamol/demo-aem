import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import ConfirmationDialogue from "../ConfirmationDialogue";
import RowActions from "../RowActions";
import LandlordForm from "../LandlordForm";
import useLandlords, {
  Landlord,
  formatLandlord,
} from "../../hooks/useLandlords";
import { defaultTableSettings } from "./tableSettings";
import { landlordService } from "../../hooks/useLandlords";
import { intializeLandlordColumns } from "../columns/landlordColumns";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

interface Props {
  createRow: boolean;
  onExitCreateMode: () => void;
}

const LandlordsTable = ({ createRow, onExitCreateMode }: Props) => {
  const { landlords: data, setLandlords: setData, setError } = useLandlords();
  const [alert, setAlert] = useState({
    visibility: false,
    message: "",
    severity: "success" as AlertColor,
  });
  const [wantDelete, setDeleteDlg] = useState(false);
  const [selectedLandlord, setSelectedLandlord] = useState({
    _id: "",
    name: "",
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = useMemo<MRT_ColumnDef<Landlord>[]>(
    () => intializeLandlordColumns(colors),
    []
  );

  useEffect(() => {
    createRow ? table.setCreatingRow(true) : table.setCreatingRow(null);
  }, [createRow]);

  const defaultSettings = defaultTableSettings<Landlord>();

  const table = useMaterialReactTable({
    ...defaultSettings,
    columns,
    data,
    initialState: {
      sorting: [
        {
          id: "property.pID",
          desc: false,
        },
      ],
      columnVisibility: {
        rentPeriodStart: false,
        rentPeriodEnd: false,
      },
    },
    onCreatingRowCancel: () => {
      onExitCreateMode();
    },
    renderCreateRowDialogContent: () => (
      <LandlordForm onCancel={handleCancel} onCreate={handleCreateLandlord} />
    ),
    renderEditRowDialogContent: ({ row }) => (
      <LandlordForm
        onCancel={handleCancel}
        onUpdate={handleEditLandlord}
        row={row}
      />
    ),
    renderRowActions: ({ row, table }) => (
      <RowActions
        onEdit={() => table.setEditingRow(row)}
        onDelete={() => {
          setSelectedLandlord(row.original);
          setDeleteDlg(true);
        }}
      />
    ),
  });

  const handleCreateLandlord = (newLandlord: Landlord) => {
    const originalLandlords = [...data];

    // Update the data - Optimistic
    setData([newLandlord, ...data]);

    // Send req
    landlordService
      .create(newLandlord)
      .then(({ data: savedLandlord }) => {
        setData([formatLandlord(savedLandlord), ...data]);
        // Update user
        toggleAlert(
          "success",
          `Landlord ${newLandlord.name} was successfully added!`
        );
      })
      .catch((err) => {
        setError(err.response.data);
        toggleAlert("error", err.response.data);
        setData(originalLandlords);
      });

    // Exit Create mode
    table.setCreatingRow(null);
    onExitCreateMode();
  };

  const handleEditLandlord = (updatedLandlord: Landlord, id: string) => {
    const originalLandlords = [...data];

    // Update the data - Optimistic update
    setData(
      data.map((l) =>
        l._id == id ? formatLandlord({ ...l, ...updatedLandlord }) : l
      )
    );

    // Preare the body
    const modifiedLandlord = {
      ...updatedLandlord,
      _id: id,
    };

    // Send req
    landlordService
      .update(modifiedLandlord)
      .then(() =>
        toggleAlert(
          "success",
          `Landlord ${updatedLandlord.name} was successfully updated!`
        )
      )
      .catch((err) => {
        setError(err.message);
        toggleAlert("error", err.response.data);
        setData(originalLandlords);
      });

    // Exit Edit mode
    table.setEditingRow(null);
  };

  const handleDeleteLandlord = () => {
    const originalLandlords = [...data];

    // Update the data
    setData(data.filter((l) => l._id !== selectedLandlord?._id));

    // Send req to delete
    landlordService
      .delete(selectedLandlord._id)
      .then(() =>
        toggleAlert(
          "success",
          `Landlord ${selectedLandlord?.name} was successfully deleted!`
        )
      )
      .catch((err) => {
        setError(err);
        toggleAlert("error", err.message);
        setData(originalLandlords);
      });

    // Update user
    setDeleteDlg(false);
  };

  const handleCancel = () => {
    // Exit the row's editing & creating modes
    table.setEditingRow(null);
    table.setCreatingRow(null);
    onExitCreateMode();
  };

  const toggleAlert = (severity: AlertColor, message: string) => {
    setAlert({
      visibility: true,
      message,
      severity,
    });
  };

  return (
    <>
      <MaterialReactTable table={table} />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={alert.visibility}
        autoHideDuration={5000}
        onClose={() =>
          setAlert({
            visibility: false,
            message: alert.message,
            severity: alert.severity,
          })
        }
      >
        <Alert severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
      <ConfirmationDialogue
        open={wantDelete}
        onConfirm={handleDeleteLandlord}
        onClose={() => setDeleteDlg(false)}
        titleText={`Delete landlord ${selectedLandlord?.name} ?`}
        contentText="This action cannot be undone. Are you sure you want to delete this
        landlord?"
        buttonText="Delete"
      />
    </>
  );
};

export default LandlordsTable;
