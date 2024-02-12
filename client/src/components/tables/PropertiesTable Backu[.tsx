import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Snackbar, Alert } from "@mui/material";
import PropertyForm from "../PropertyForm";
import ConfirmationDialogue from "../ConfirmationDialogue";
import RowActions from "../RowActions";
import useProperties, {
  Property,
  propertyService,
} from "../../hooks/useProperties";

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
  initialData: Property[];
  createRow: boolean;
  onExitCreateMode: () => void;
}

const PropertiesTable = ({
  initialData,
  createRow,
  onExitCreateMode,
}: Props) => {
  const {
    properties: data,
    error,
    isLoading,
    setProperties: setData,
    setError,
  } = useProperties();
  const [alert, setAlert] = useState({
    visibility: false,
    message: "",
  });
  const [wantDelete, setDeleteDlg] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState({
    _id: "",
    pID: "",
  });

  // Get all the LLs & tenants in this dummy data
  const tenantsList = initialData.map((p) => p.tID);

  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<Property>[]>(
    () => [
      {
        accessorKey: "pID",
        header: "P-ID",
        size: 100,
        filterVariant: "multi-select",
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 200,
        filterVariant: "multi-select",
      },
      {
        accessorKey: "postCode",
        header: "Post Code",
        size: 150,
        filterVariant: "multi-select",
      },
      {
        accessorKey: "landlord.llID",
        header: "LL-ID",
        size: 100,
        filterVariant: "multi-select",
      },
      {
        accessorKey: "tID",
        header: "T-ID",
        size: 100,
        filterVariant: "multi-select",
      },
    ],
    []
  );

  useEffect(() => {
    createRow ? table.setCreatingRow(true) : table.setCreatingRow(null);
  }, [createRow]);

  const table = useMaterialReactTable({
    columns,
    data,
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
    initialState: {
      sorting: [
        {
          id: "pID",
          desc: false,
        },
      ],
    },
    muiTableHeadCellProps: {
      sx: tableFont,
    },
    muiTableBodyCellProps: {
      sx: tableFont,
    },
    onCreatingRowCancel: () => {
      onExitCreateMode();
    },
    renderCreateRowDialogContent: () => (
      <PropertyForm
        onCreate={handleCreateProperty}
        onCancel={handleCancel}
        tenantsList={tenantsList}
      />
    ),
    renderEditRowDialogContent: ({ row }) => (
      <PropertyForm
        onUpdate={handleEditProperty}
        onCancel={handleCancel}
        row={row}
        tenantsList={tenantsList}
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
    };
    delete modifiedProperty.landlord;

    // Send req to create property
    propertyService
      .create(modifiedProperty)
      .then(({ data: savedProperty }) => {
        if (!savedProperty.landlord)
          savedProperty.landlord = { _id: "", llID: "" };

        setData([savedProperty, ...data]);
      })
      .catch((err) => {
        setError(err.message);
        setData(originalProperties);
      });

    // Exit Create mode
    table.setCreatingRow(null);
    onExitCreateMode();
    // Update user
    toggleAlert(`Property ${newProperty.pID} was successfully added!`);
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
    };
    delete modifiedProperty.landlord;

    // Send req to update property
    propertyService.update(modifiedProperty).catch((err) => {
      setError(err.message);
      setData(originalProperties);
    });

    // Exit Edit mode
    table.setEditingRow(null);

    // Update user
    toggleAlert(`Property ${updatedProperty.pID} was successfully updated!`);
  };

  const handleDeleteProperty = () => {
    const originalProperties = [...data];

    // Update the data - Optimistic update
    setData(data.filter((p) => p._id !== selectedProperty._id));

    // Send req to delete
    propertyService.delete(selectedProperty._id).catch((err) => {
      setError(err.message);
      setData(originalProperties);
    });

    // Update user
    setDeleteDlg(false);
    toggleAlert(`Property ${selectedProperty?.pID} was successfully deleted!`);
  };

  const handleCancel = () => {
    // Exit the row's editing & creating modes
    table.setEditingRow(null);
    table.setCreatingRow(null);
    onExitCreateMode();
  };

  const toggleAlert = (msg: string) => {
    setAlert({
      visibility: true,
      message: msg,
    });
  };

  return (
    <>
      <MaterialReactTable table={table} />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={alert.visibility}
        autoHideDuration={5000}
        onClose={() => setAlert({ visibility: false, message: "" })}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
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
