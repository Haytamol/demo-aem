import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import PropertyForm from "../PropertyForm";
import ConfirmationDialogue from "../ConfirmationDialogue";
import RowActions from "../RowActions";
import useProperties, {
  Property,
  propertyService,
} from "../../hooks/useProperties";
import { defaultTableSettings } from "./tableSettings";
import { intializePropertyColumns } from "../columns/propertyColumns";

interface Props {
  initialData: Property[];
  createRow: boolean;
  onExitCreateMode: () => void;
}

const PropertiesTable = ({ createRow, onExitCreateMode }: Props) => {
  const {
    properties: data,
    setProperties: setData,
    setError,
  } = useProperties();
  const [alert, setAlert] = useState({
    visibility: false,
    message: "",
    severity: "success" as AlertColor,
  });
  const [wantDelete, setDeleteDlg] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState({
    _id: "",
    pID: "",
  });

  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<Property>[]>(
    () => intializePropertyColumns(),
    []
  );

  useEffect(() => {
    createRow ? table.setCreatingRow(true) : table.setCreatingRow(null);
  }, [createRow]);

  const defaultSettings = defaultTableSettings<Property>();

  const table = useMaterialReactTable({
    ...defaultSettings,
    columns,
    data,
    initialState: {
      sorting: [
        {
          id: "pID",
          desc: false,
        },
      ],
    },
    onCreatingRowCancel: () => {
      onExitCreateMode();
    },
    renderCreateRowDialogContent: () => (
      <PropertyForm onCreate={handleCreateProperty} onCancel={handleCancel} />
    ),
    renderEditRowDialogContent: ({ row }) => (
      <PropertyForm
        onUpdate={handleEditProperty}
        onCancel={handleCancel}
        row={row}
      />
    ),
    renderRowActions: ({ row, table }) => (
      <RowActions
        onEdit={() => table.setEditingRow(row)}
        onDelete={() => {
          setSelectedProperty(row.original);
          setDeleteDlg(true);
        }}
      />
    ),
  });

  const handleCreateProperty = (newProperty: Property) => {
    const originalProperties = [...data];

    // Update the data - Optimistic update
    setData([newProperty, ...data]);

    // Prepare the body of the request
    const modifiedProperty = {
      ...newProperty,
      landlordId: newProperty.landlord?._id || undefined,
      tenantId: newProperty.tenant?._id || undefined,
    };
    delete modifiedProperty.landlord;
    delete modifiedProperty.tenant; 

    // Send req to create property
    propertyService
      .create(modifiedProperty)
      .then(({ data: savedProperty }) => {
        if (!savedProperty.landlord)
          savedProperty.landlord = { _id: "", llID: "" };

        if (!savedProperty.tenant) 
          savedProperty.tenant = { _id: "", tID: "" };

        setData([savedProperty, ...data]);
        // Update user
        toggleAlert(
          "success",
          `Property ${newProperty.pID} was successfully added!`
        );
      })
      .catch((err) => {
        setError(err.response.data);
        toggleAlert("error", err.response.data);
        setData(originalProperties);
      });

    // Exit Create mode
    table.setCreatingRow(null);
    onExitCreateMode();
  };

  const handleEditProperty = (updatedProperty: Property, id: string) => {
    const originalProperties = [...data];

    // Update the data - Optimistic update
    setData(
      data.map((p) => (p._id == id ? { ...updatedProperty, _id: id } : p))
    );

    // Prepare the body of the request
    const modifiedProperty = {
      ...updatedProperty,
      _id: id,
      landlordId: updatedProperty.landlord?._id || undefined,
      tenantId: updatedProperty.tenant?._id || undefined,
    };
    delete modifiedProperty.landlord;
    delete modifiedProperty.tenant;

    // Send req to update property
    propertyService
      .update(modifiedProperty)
      .then(() =>
        toggleAlert(
          "success",
          `Property ${updatedProperty.pID} was successfully updated!`
        )
      )
      .catch((err) => {
        setError(err.message);
        toggleAlert("error", err.response.data);
        setData(originalProperties);
      });

    // Exit Edit mode
    table.setEditingRow(null);
  };

  const handleDeleteProperty = () => {
    const originalProperties = [...data];

    // Update the data - Optimistic update
    setData(data.filter((p) => p._id !== selectedProperty._id));

    // Send req to delete
    propertyService
      .delete(selectedProperty._id)
      .then(() =>
        toggleAlert(
          "success",
          `Property ${selectedProperty?.pID} was successfully deleted!`
        )
      )
      .catch((err) => {
        setError(err);
        toggleAlert("error", err.message);
        setData(originalProperties);
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
        <Alert
          severity={alert.severity}
          sx={{ width: "100%", alignItems: "center" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <ConfirmationDialogue
        open={wantDelete}
        onConfirm={handleDeleteProperty}
        onClose={() => setDeleteDlg(false)}
        titleText={`Delete property ${selectedProperty?.pID} ?`}
        contentText="This action cannot be undone. Are you sure you want to delete this
        property?"
        buttonText="Delete"
      />
    </>
  );
};

export default PropertiesTable;
