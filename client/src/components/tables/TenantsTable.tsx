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
import TenantForm from "../TenantForm";
import useTenants, {
  Tenant,
  formatTenant,
  tenantService,
} from "../../hooks/useTenants";
import { intializeTenantColumns } from "../columns/tenantsColumns";
import { defaultTableSettings } from "./tableSettings";

interface Props {
  initialData: Tenant[];
  createRow: boolean;
  onExitCreateMode: () => void;
}

const TenantsTable = ({ createRow, onExitCreateMode }: Props) => {
  const { tenants: data, setTenants: setData, setError } = useTenants();
  const [alert, setAlert] = useState({
    visibility: false,
    message: "",
    severity: "success" as AlertColor,
  });
  const [wantDelete, setDeleteDlg] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState({ _id: "", name: "" });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<Tenant>[]>(
    () => intializeTenantColumns(colors),
    []
  );

  useEffect(() => {
    createRow ? table.setCreatingRow(true) : table.setCreatingRow(null);
  }, [createRow]);

  const defaultSettings = defaultTableSettings<Tenant>();

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
      <TenantForm onCancel={handleCancel} onCreate={handleCreateTenant} />
    ),
    renderEditRowDialogContent: ({ row }) => (
      <TenantForm
        onCancel={handleCancel}
        onUpdate={handleEditTenant}
        row={row}
      />
    ),
    renderRowActions: ({ row, table }) => (
      <RowActions
        onEdit={() => table.setEditingRow(row)}
        onDelete={() => {
          setSelectedTenant(row.original);
          setDeleteDlg(true);
        }}
      />
    ),
  });

  const handleCreateTenant = (newTenant: Tenant) => {
    const originalTenants = [...data];

    // Update the data - Optimistic
    setData([newTenant, ...data]);

    // Prepare the body of the request
    const modifiedTenant = {
      ...newTenant,
      landlord: undefined,
    };

    // Send req
    tenantService
      .create(modifiedTenant)
      .then(({ data: savedTenant }) => {
        setData([formatTenant(savedTenant), ...data]);
        // Update user
        toggleAlert(
          "success",
          `Tenant ${newTenant.name} was successfully added!`
        );
      })
      .catch((err) => {
        setError(err.response.data);
        toggleAlert("error", err.response.data);
        setData(originalTenants);
      });

    // Exit Create mode
    table.setCreatingRow(null);
    onExitCreateMode();
  };

  const handleEditTenant = (updatedTenant: Tenant, id: string) => {
    const originalTenants = [...data];

    // Update the data - Optimistic
    setData(data.map((t) => (t._id == id ? { ...t, ...updatedTenant } : t)));

    // Prepare the body of the request
    const modifiedTenant = {
      ...updatedTenant,
      _id: id,
    };

    // Send req
    tenantService
      .update(modifiedTenant)
      .then(() =>
        toggleAlert(
          "success",
          `Tenant ${updatedTenant.name} was successfully updated!`
        )
      )
      .catch((err) => {
        setError(err.message);
        toggleAlert("error", err.response.data);
        setData(originalTenants);
      });

    // Exit Edit mode
    table.setEditingRow(null);
  };

  const handleDeleteTenant = () => {
    const originalTenants = [...data];
    // Update the data
    setData(data.filter((t) => t._id !== selectedTenant?._id));

    // Send req to delete
    tenantService
      .delete(selectedTenant._id)
      .then(() =>
        toggleAlert(
          "success",
          `Tenant ${selectedTenant?.name} was successfully deleted!`
        )
      )
      .catch((err) => {
        setError(err);
        toggleAlert("error", err.message);
        setData(originalTenants);
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
        onConfirm={handleDeleteTenant}
        onClose={() => setDeleteDlg(false)}
        titleText={`Delete tenant ${selectedTenant?.name} ?`}
        contentText="This action cannot be undone. Are you sure you want to delete this
        tenant?"
        buttonText="Delete"
      />
    </>
  );
};

export default TenantsTable;
