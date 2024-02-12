import { MRT_ColumnDef } from "material-react-table";
import FormattedDateCell from "../FormattedDateCell";
import FormattedNumberCell from "../FormattedNumberCell";
import { Landlord } from "../../hooks/useLandlords";

export const intializeLandlordColumns = (colors: any) => {
  const landlordsTableColumns: MRT_ColumnDef<Landlord>[] = [
    {
      accessorKey: "llID",
      header: "LL-ID",
      size: 100,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "name",
      header: "Landlord Name",
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
      accessorKey: "rentBalanceOwed",
      header: "Balance",
      size: 100,
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
      size: 100,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} />,
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.rentPeriodStart),
      accessorKey: "rentPeriodStart",
      header: "Rent Period Start",
      size: 100,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.rentPeriodEnd),
      accessorKey: "rentPeriodEnd",
      header: "Rent Period End",
      size: 100,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },
    {
      accessorKey: "rentPeriod",
      header: "Rental Period",
      size: 250,
      filterVariant: "multi-select",
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.contractStartDate),
      accessorKey: "contractStartDate",
      header: "Contract Start Date",
      size: 100,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },

    {
      accessorKey: "deposit",
      header: "Deposit",
      size: 100,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} />,
    },
    {
      accessorKey: "expensesNotChargedToLL",
      header: "Expenses",
      size: 100,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} />,
    },
  ];

  return landlordsTableColumns;
};
