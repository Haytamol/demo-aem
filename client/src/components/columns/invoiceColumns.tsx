import { MRT_ColumnDef } from "material-react-table";
import FormattedDateCell from "../FormattedDateCell";
import FormattedNumberCell from "../FormattedNumberCell";
import { Invoice } from "../../hooks/useInvoices";
import FormattedTextCell from "../FormattedTextCell";
import FormattedCheckboxCell from "../FormattedCheckboxCell";

export const intializeInvoiceColumns = (colors: any) => {
  const invoicesTableColumns: MRT_ColumnDef<Invoice>[] = [
    {
      accessorFn: (originalRow) => new Date(originalRow.date),
      accessorKey: "date",
      header: "Date",
      size: 100,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },
    {
      accessorKey: "property.pID",
      header: "P-ID",
      size: 150,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "invNum",
      header: "Invoice Number",
      size: 150,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "property.llID",
      header: "LL-ID",
      size: 150,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "property.tID",
      header: "T-ID",
      size: 150,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "rentalPeriod",
      header: "Rental Period",
      size: 230,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "supplier",
      header: "Supplier",
      size: 150,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "category",
      header: "Category",
      size: 150,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 150,
      filterVariant: "multi-select",
    },
    {
      accessorKey: "amount",
      header: "InvoiceAmount",
      size: 150,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} />,
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      size: 150,
      filterVariant: "multi-select",
      Cell: ({ cell }) => (
        <FormattedTextCell
          cell={cell}
          backgroundColor={
            cell.getValue<string>() == "Unpaid"
              ? colors.redAccent[500]
              : cell.getValue<string>() == "Charged to Landlord"
              ? "orange"
              : colors.greenAccent[400]
          }
          color="#fff"
        />
      ),
    },
    {
      accessorFn: (originalRow) =>
        new Date(originalRow.dateAgentPaidInvoice || ""),
      accessorKey: "dateAgentPaidInvoice",
      header: "Date Agent Paid Invoice",
      size: 300,
      filterVariant: "date-range",
      Cell: ({ cell }) => <FormattedDateCell cell={cell} />,
    },
    {
      accessorKey: "addToLLBalance",
      header: "Add to LL Balance",
      size: 150,
      filterVariant: "checkbox",
      Cell: ({ cell }) => <FormattedCheckboxCell cell={cell} />,
    },
    {
      accessorKey: "paidByTenant",
      header: "Paid by Tenant",
      size: 150,
      filterVariant: "checkbox",
      Cell: ({ cell }) => <FormattedCheckboxCell cell={cell} />,
    },
    {
      accessorKey: "RCND",
      header: "RCND",
      size: 150,
      filterVariant: "checkbox",
      Cell: ({ cell }) => <FormattedCheckboxCell cell={cell} />,
    },
    {
      accessorKey: "paidAmount",
      header: "Paid Amount",
      size: 150,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} />,
    },
    {
      accessorKey: "paidAmountByTenant",
      header: "Paid Amount by Tenant",
      size: 300,
      columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
      filterFn: "between",
      Cell: ({ cell }) => <FormattedNumberCell cell={cell} />,
    },
  ];
  return invoicesTableColumns;
};
