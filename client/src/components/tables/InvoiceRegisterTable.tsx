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
import InvoiceForm from "../InvoiceForm";
import useInvoices, {
  Invoice,
  formatInvoice,
  invoiceService,
} from "../../hooks/useInvoices";
import { intializeInvoiceColumns } from "../columns/invoiceColumns";
import { defaultTableSettings } from "./tableSettings";

interface Props {
  createRow: boolean;
  onExitCreateMode: () => void;
}

const InvoiceRegisterTable = ({ createRow, onExitCreateMode }: Props) => {
  const { invoices: data, setInvoices: setData, setError } = useInvoices();
  const [alert, setAlert] = useState({
    visibility: false,
    message: "",
    severity: "success" as AlertColor,
  });
  const [wantDelete, setDeleteDlg] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState({
    _id: "",
    invNum: "",
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
    () => intializeInvoiceColumns(colors),
    []
  );

  useEffect(() => {
    createRow ? table.setCreatingRow(true) : table.setCreatingRow(null);
  }, [createRow]);

  const defaultSettings = defaultTableSettings<Invoice>();

  const table = useMaterialReactTable({
    ...defaultSettings,
    columns,
    data,
    onCreatingRowCancel: () => {
      onExitCreateMode();
    },
    renderCreateRowDialogContent: () => (
      <InvoiceForm onCancel={handleCancel} onCreate={handleCreateInvoice} />
    ),
    renderEditRowDialogContent: ({ row }) => (
      <InvoiceForm
        onCancel={handleCancel}
        onUpdate={handleEditInvoice}
        row={row}
      />
    ),
    renderRowActions: ({ row, table }) => (
      <RowActions
        onEdit={() => table.setEditingRow(row)}
        onDelete={() => {
          setSelectedInvoice(row.original);
          setDeleteDlg(true);
        }}
      />
    ),
  });

  const handleCreateInvoice = (newInvoice: Invoice) => {
    const originalEntries = [...data];

    // Update the data - Optimistic
    setData([newInvoice, ...data]);

    // Prepare the req's body
    const { property, ...otherProps } = newInvoice;
    const propertyId = property?._id || undefined;
    const modifiedInvoice = { ...otherProps, propertyId };

    // Send req
    invoiceService
      .create(modifiedInvoice)
      .then(({ data: savedInvoice }) => {
        console.log("saved entry", formatInvoice(savedInvoice));

        setData([...data, formatInvoice(savedInvoice)]);
        // Update user
        toggleAlert(
          "success",
          `Invoice ${newInvoice.invNum} was successfully added.`
        );
      })
      .catch((err) => {
        setError(err.response.data);
        toggleAlert("error", err.response.data);
        setData(originalEntries);
      });

    // Exit Create mode
    table.setCreatingRow(null);
    onExitCreateMode();
  };

  const handleEditInvoice = (updatedInvoice: Invoice, id: string) => {
    const originalEntries = [...data];

    // Update the data - optimistic
    setData(data.map((i) => (i._id == id ? { ...i, ...updatedInvoice } : i)));

    // Prepare the req's body
    const { property, ...otherProps } = updatedInvoice;
    const propertyId = property?._id || undefined;
    const modifiedInvoice = { ...otherProps, propertyId, _id: id };

    // Send req
    invoiceService
      .update(modifiedInvoice)
      .then(({ data: savedInvoice }) => {
        setData(
          data.map((i) =>
            i._id == id ? { ...i, ...formatInvoice(savedInvoice) } : i
          )
        );
        console.log("Saved invoice", savedInvoice);

        toggleAlert(
          "success",
          `Invoice ${updatedInvoice.invNum} was successfully updated.`
        );
      })
      .catch((err) => {
        setError(err.response.data);
        toggleAlert("error", err.response.data);
        setData(originalEntries);
      });

    // Exit Edit mode
    table.setEditingRow(null);
  };

  const handleDeleteInvoice = () => {
    const originalEntries = [...data];

    // Update the data
    setData(data.filter((i) => i._id !== selectedInvoice?._id));

    // Send req to delete
    invoiceService
      .delete(selectedInvoice._id)
      .then(() =>
        toggleAlert(
          "success",
          `Invoice ${selectedInvoice.invNum} was successfully deleted.`
        )
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
        onConfirm={handleDeleteInvoice}
        onClose={() => setDeleteDlg(false)}
        titleText={`Delete invoice ${selectedInvoice?.invNum} ?`}
        contentText="This action cannot be undone. Are you sure you want to delete this
        invoice?"
        buttonText="Delete"
      />
    </>
  );
};

export default InvoiceRegisterTable;
