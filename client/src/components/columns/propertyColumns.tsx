import { MRT_ColumnDef } from "material-react-table";
import { Property } from "../../hooks/useProperties";

export const intializePropertyColumns = () => {
  const propertiesTableColumns: MRT_ColumnDef<Property>[] = [
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
      accessorKey: "tenant.tID",
      header: "T-ID",
      size: 100,
      filterVariant: "multi-select",
    },
  ];

  return propertiesTableColumns;
};
