import { MRT_ColumnDef } from "material-react-table";
import FormattedDateCell from "../FormattedDateCell";
import FormattedNumberCell from "../FormattedNumberCell";
import { BankingEntry } from "../../hooks/useBankingEntries";
import FormattedTextCell from "../FormattedTextCell";
import FormattedCheckboxCell from "../FormattedCheckboxCell";

export const intializeBankingColumns = (colors: any) => {
  const BankingTableColumns: MRT_ColumnDef<BankingEntry>[] = [
    {
      accessorFn: (originalRow) => new Date(originalRow.date),
      accessorKey: "date",
      header: "Date",
      size: 100,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },
    {
      accessorKey: "type",
      header: "Credit/Debit",
      size: 200,
      filterVariant: "multi-select",
      Cell: ({ cell }) => (
        <FormattedTextCell
          cell={cell}
          backgroundColor={
            cell.getValue<string>() == "Debit"
              ? colors.redAccent[500]
              : colors.greenAccent[400]
          }
          color="#fff"
        />
      ),
    },
    {
      accessorKey: "category",
      header: "Type",
      size: 200,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "property.pID",
      header: "P-ID",
      size: 200,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "invoiceNum",
      header: "Invoice Number",
      size: 200,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "property.llID",
      header: "LL-ID",
      size: 200,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "property.tID",
      header: "T-ID",
      size: 200,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      size: 200,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell, row }) => (
        <FormattedNumberCell
          cell={cell}
          backgroundColor={
            row.original.type == "Debit"
              ? colors.redAccent[500]
              : colors.greenAccent[400]
          }
          color="#fff"
          zeroIsEmpty
        />
      ),
    },
    {
      accessorKey: "rentalPeriod",
      header: "Rental Period",
      size: 250,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "reference",
      header: "Reference",
      size: 200,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "toFromAccount",
      header: "To/From Account",
      size: 200,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "runningBalance",
      header: "Running Balance",
      size: 200,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} />,
    },
    {
      accessorKey: "complete",
      header: "Complete",
      size: 100,
      filterVariant: "checkbox",
      Cell: ({ cell }) => <FormattedCheckboxCell cell={cell} />,
    },
    {
      accessorKey: "invoiceListed",
      header: "Invoice Listed",
      size: 100,
      filterVariant: "checkbox",
      Cell: ({ cell }) => <FormattedCheckboxCell cell={cell} />,
    },
  ];

  return BankingTableColumns;
};
