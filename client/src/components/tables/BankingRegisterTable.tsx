import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Snackbar, Alert, useTheme, AlertColor } from "@mui/material";
import ConfirmationDialogue from "../ConfirmationDialogue";
import RowActions from "../RowActions";
import { tokens } from "../../theme";
import BankingRegisterForm from "../BankingRegisterForm";
import useLLBalanceEntries, {
  BankingEntry,
  bankingService,
  formatEntry,
  calculateRunningBalance,
} from "../../hooks/useBankingEntries";
import { intializeBankingColumns } from "../columns/bankingColumns";
import { defaultTableSettings } from "./tableSettings";

interface Props {
  createRow: boolean;
  onExitCreateMode: () => void;
}

const BankingRegisterTable = ({ createRow, onExitCreateMode }: Props) => {
  const {
    bankingEntries: data,
    setBankingEntries: setData,
    setError,
  } = useLLBalanceEntries();
  const [alert, setAlert] = useState({
    visibility: false,
    message: "",
    severity: "success" as AlertColor,
  });
  const [wantDelete, setDeleteDlg] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState({ _id: "" });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<BankingEntry>[]>(
    () => intializeBankingColumns(colors),
    []
  );

  useEffect(() => {
    createRow ? table.setCreatingRow(true) : table.setCreatingRow(null);
  }, [createRow]);

  const defaultSettings = defaultTableSettings<BankingEntry>();

  const table = useMaterialReactTable({
    ...defaultSettings,
    columns,
    data,
    initialState: {
      sorting: [
        {
          id: "date",
          desc: false,
        },
      ],
    },
    onCreatingRowCancel: () => {
      onExitCreateMode();
    },
    renderCreateRowDialogContent: () => (
      <BankingRegisterForm
        onCancel={handleCancel}
        onCreate={handleCreateEntry}
      />
    ),
    renderEditRowDialogContent: ({ row }) => (
      <BankingRegisterForm
        onCancel={handleCancel}
        onUpdate={handleEditEntry}
        row={row}
      />
    ),
    renderRowActions: ({ row, table }) => (
      <RowActions
        onEdit={() => table.setEditingRow(row)}
        onDelete={() => {
          setSelectedEntry(row.original);
          setDeleteDlg(true);
        }}
      />
    ),
  });

  const handleCreateEntry = (newEntry: BankingEntry) => {
    const originalEntries = [...data];

    // Update the data - Optimistic
    setData([newEntry, ...data]);

    // Prepare the req's body
    console.log("New entry here", newEntry);

    const { property, ...otherProps } = newEntry;
    const propertyId = property?._id || undefined;
    const modifiedEntry = { ...otherProps, propertyId };

    // Send req
    bankingService
      .create(modifiedEntry)
      .then(({ data: savedEntry }) => {
        console.log("saved entry", savedEntry);
        // Calculate running balance for the entire list (including the new entry)
        const formattedData = calculateRunningBalance([
          ...data,
          formatEntry(savedEntry),
        ]);

        setData(formattedData);
        // Update user
        toggleAlert("success", `New Banking Entry was successfully added.`);
      })
      .catch((err) => {
        setError(err.response.data);
        toggleAlert("error", err.response.data);
        setData(originalEntries);
      });

    // Exit Create mode
    table.setCreatingRow(null);
    onExitCreateMode();
    // Update user
  };

  const handleEditEntry = (updatedEntry: BankingEntry, id: string) => {
    const originalEntries = [...data];

    // Update the data
    setData(
      data.map((e) => (e._id == id ? { ...e, ...updatedEntry, _id: id } : e))
    );

    const { property, ...otherProps } = updatedEntry;
    const propertyId = property?._id || undefined;
    const modifiedEntry = { ...otherProps, propertyId, _id: id };

    // Send req
    bankingService
      .update(modifiedEntry)
      .then(() => {
        toggleAlert("success", `New Banking Entry was successfully updated.`);
      })
      .catch((err) => {
        setError(err.response.data);
        toggleAlert("error", err.response.data);
        setData(originalEntries);
      });

    // Exit Edit mode
    table.setEditingRow(null);
  };

  const handleDeleteEntry = () => {
    const originalEntries = [...data];

    // Update the data - Optimisic
    setData(data.filter((e) => e._id !== selectedEntry?._id));

    // Send req to delete
    bankingService
      .delete(selectedEntry._id)
      .then(() =>
        toggleAlert("success", `The selected entry was successfully deleted!`)
      )
      .catch((err) => {
        setError(err);
        toggleAlert("error", err.message);
        setData(originalEntries);
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
        onConfirm={handleDeleteEntry}
        onClose={() => setDeleteDlg(false)}
        titleText={`Delete this entry ?`}
        contentText={`This action cannot be undone. Are you sure you want to delete the selected entry?`}
        buttonText="Delete"
      />
    </>
  );
};

export default BankingRegisterTable;
