import { MRT_ColumnDef } from "material-react-table";
import FormattedDateCell from "../FormattedDateCell";
import FormattedNumberCell from "../FormattedNumberCell";
import { Tenant } from "../../hooks/useTenants";

export const intializeTenantColumns = (colors: any) => {
  const tenantsTableColumns: MRT_ColumnDef<Tenant>[] = [
    {
      accessorKey: "tID",
      header: "T-ID",
      size: 100,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "name",
      header: "Tenant Name",
      size: 150,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "property.pID",
      header: "P-ID",
      size: 100,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "property.address",
      header: "Address",
      size: 200,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "balance",
      header: "Balance",
      size: 150,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => (
        <FormattedNumberCell
          cell={cell}
          backgroundColor={
            cell.getValue<number>() <= 0
              ? colors.greenAccent[400]
              : colors.redAccent[500]
          }
          color="#fff"
        />
      ),
    },
    {
      accessorKey: "rentAmount",
      header: "Rent Amount",
      size: 150,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} />,
    },
    {
      accessorKey: "rentPaymentDay",
      header: "Payment Day",
      size: 150,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
    },
    {
      accessorFn: (originalRow) =>
        new Date(originalRow.landlord?.rentPeriodStart),
      accessorKey: "landlord.rentPeriodStart",
      id: "rentPeriodStart",
      header: "Rental Start Date",
      size: 150,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },
    {
      accessorFn: (originalRow) =>
        new Date(originalRow.landlord?.rentPeriodEnd),
      accessorKey: "landlord.rentPeriodEnd",
      id: "rentPeriodEnd",
      header: "Rental End Date",
      size: 150,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },
    {
      accessorKey: "landlord.rentPeriod",
      header: "Rental Period",
      size: 220,
      filterVariant: "multi-select",
    },
    {
      accessorFn: (originalRow) =>
        new Date(originalRow.landlord?.contractStartDate),
      accessorKey: "landlord.contractStartDate",
      header: "Contract Start Date",
      size: 150,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.tenantRealStartDate),
      accessorKey: "tenantRealStartDate",
      header: "Real Start Date",
      size: 150,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },

    {
      accessorKey: "refundAmount",
      header: "Refund Amount",
      size: 150,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} />,
    },
  ];

  return tenantsTableColumns;
};
