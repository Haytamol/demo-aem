import { MRT_ColumnDef } from "material-react-table";
import FormattedDateCell from "../FormattedDateCell";
import FormattedNumberCell from "../FormattedNumberCell";
import { LLBalanceEntry } from "../../hooks/useLLBalanceEntries";

export const intializeLLBalanceColumns = () => {
  const llBalanceColumns: MRT_ColumnDef<LLBalanceEntry>[] = [
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
      accessorKey: "amountDueToLL",
      header: "Amount Due to LL",
      size: 100,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} zeroIsEmpty />,
    },
    {
      accessorKey: "debitedToLL",
      header: "Debited to LL",
      size: 100,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} zeroIsEmpty />,
    },
    {
      accessorKey: "expensesOrInvoices",
      header: "Expenses/Invoices",
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
      accessorKey: "hiddenRent",
      header: "Hidden Rent",
      size: 100,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} zeroIsEmpty />,
    },
  ];

  return llBalanceColumns;
};
