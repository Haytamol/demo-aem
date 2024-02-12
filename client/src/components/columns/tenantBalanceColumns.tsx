import { MRT_ColumnDef } from "material-react-table";
import FormattedDateCell from "../FormattedDateCell";
import FormattedNumberCell from "../FormattedNumberCell";
import { TenantBalanceEntry } from "../../hooks/useTenantBalanceEntries";

export const intializeTenantBalanceColumns = () => {
  const tenantBalanceColumns: MRT_ColumnDef<TenantBalanceEntry>[] = [
    {
      accessorKey: "type",
      header: "Type",
      size: 300,
      filterVariant: "multi-select",
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.date),
      accessorKey: "date",
      header: "Date",
      size: 100,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },
    {
      accessorKey: "rentalPeriod",
      header: "Rental Period",
      size: 250,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "rentDue",
      header: "Rent Due",
      size: 100,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} zeroIsEmpty />,
    },
    {
      accessorKey: "rentPaidByTenant",
      header: "Rent Paid by Tenant",
      size: 100,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} zeroIsEmpty />,
    },

    {
      accessorKey: "rentalPeriodBalance",
      header: "Rental Period Balance",
      size: 300,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} zeroIsEmpty />,
    },
    {
      accessorKey: "runningBalance",
      header: "Running Balance",
      size: 100,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} zeroIsEmpty />,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      filterVariant: "multi-select",
    },
  ];

  return tenantBalanceColumns;
};
