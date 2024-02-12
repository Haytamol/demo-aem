import { type MRT_Row } from "material-react-table";

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  InputAdornment,
  InputLabel,
  FormControl,
  Input,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { Invoice } from "../hooks/useInvoices";
import useProperties from "../hooks/useProperties";
import { useEffect, useState } from "react";
import createDateRanges from "../services/rentalPeriodDropdown";

const suppliers = [
  "LPS",
  "Flexo Furniture",
  "BEL",
  "Alpha Estate Management Limited",
];
const categories = ["Furniture", "Licensing", "Maintenance", "Letting Fee"];

const schema = z.object({
  date: z.string().datetime(),
  property: z.object({
    _id: z
      .string()
      .min(1, { message: "Please select the concerned property." }),
  }),
  invNum: z.string(),
  rentalPeriod: z.string(),
  supplier: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().optional(),
  addToLLBalance: z.boolean().optional(),
});

interface Props {
  onCreate?: (invoice: Invoice) => void;
  onUpdate?: (invoice: Invoice, id: string) => void;
  onCancel: () => void;
  row?: MRT_Row<Invoice>; // Row optional for new properties
}

const InvoiceForm = ({ onUpdate, onCreate, onCancel, row }: Props) => {
  const { properties } = useProperties();
  const [selectedPropertyId, selectProperty] = useState(
    row ? row.original.property._id : ""
  );
  const [rentPeriods, setRentPeriods] = useState<string[]>([]);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Invoice>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const property = properties.find((p) => p._id === selectedPropertyId);
    const rentPeriodStart = property?.landlord?.rentPeriodStart;
    const rentPeriodEnd = property?.landlord?.rentPeriodEnd;
    const contractStartDate = property?.landlord?.contractStartDate;

    if (
      rentPeriodStart !== undefined &&
      rentPeriodEnd !== undefined &&
      contractStartDate !== undefined
    ) {
      setRentPeriods(
        createDateRanges(rentPeriodStart, rentPeriodEnd, contractStartDate)
      );
    }
  }, [selectedPropertyId, properties]);

  return (
    <form
      onSubmit={handleSubmit((invoice) => {
        const property = properties.find(
          (p) => p._id === invoice.property?._id
        );

        const newInvoice = {
          ...invoice,
          property: property
            ? {
                _id: property._id,
                pID: property.pID,
                llID: property.landlord?.llID || "",
                tID: property.tenant?.tID || "",
              }
            : { _id: "", pID: "", llID: "", tID: "" },
        };

        // Update the payment status on creation
        if (!row) {
          if (invoice.addToLLBalance) {
            newInvoice.paymentStatus = "Charged to Landlord";
          } else {
            newInvoice.paymentStatus = "Unpaid";
          }
        }

        if (row) {
          onUpdate && onUpdate(newInvoice, row?.original._id);
        } else {
          onCreate && onCreate(newInvoice);
        }
        // Reset the form to its initial state
        reset();
      })}
    >
      <DialogTitle sx={{ fontSize: 18 }}>
        {row ? "Edit" : "Add"} Invoice
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <Controller
          control={control}
          name="date"
          defaultValue={
            row ? dayjs(row.original.date).toISOString() : dayjs().toISOString()
          }
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label="Date"
              views={["year", "month", "day"]}
              onChange={(date) => {
                onChange(dayjs(date).toISOString());
              }}
              value={dayjs(value)}
              slotProps={{
                textField: {
                  helperText: errors.date?.message,
                },
              }}
              sx={{ marginTop: "1rem" }}
            />
          )}
        />
        {properties.length && (
          <TextField
            id="pID"
            required
            error={errors.property?._id ? true : false}
            helperText={errors.property?._id?.message}
            select
            label="P-ID"
            defaultValue={row ? row.original.property?._id : ""}
            {...register("property._id")}
            onChange={(e) => {
              selectProperty(e.target.value);
            }}
          >
            {properties.map((p) => (
              <MenuItem key={p._id} value={p._id}>
                {p.pID}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          id="invoiceNum"
          required
          label="Invoice Number"
          variant="standard"
          defaultValue={row ? row.original.invNum : ""}
          {...register("invNum")}
        />
        {rentPeriods.length ? (
          <TextField
            id="rentalPeriod"
            error={errors.rentalPeriod ? true : false}
            helperText={errors.rentalPeriod?.message}
            select
            label="Rental Period"
            defaultValue={row ? row.original.rentalPeriod : ""}
            {...register("rentalPeriod")}
          >
            {rentPeriods.map((rp) => (
              <MenuItem key={rp} value={rp}>
                {rp}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
        <TextField
          id="supplier"
          error={errors.supplier ? true : false}
          select
          label="Supplier"
          defaultValue={row ? row.original.supplier : ""}
          {...register("supplier")}
        >
          {suppliers.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="categories"
          error={errors.category ? true : false}
          select
          label="Category"
          defaultValue={row ? row.original.category : ""}
          {...register("category")}
        >
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="description"
          label="Description"
          variant="standard"
          defaultValue={row ? row.original.description : ""}
          {...register("description")}
        />
        <FormControl variant="standard">
          <InputLabel>Invoice Amount</InputLabel>
          <Input
            id="amount"
            required
            error={errors.amount ? true : false}
            startAdornment={<InputAdornment position="start">£</InputAdornment>}
            defaultValue={row ? row.original.amount : 0}
            {...register("amount", { valueAsNumber: true })}
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={row ? row.original.addToLLBalance : false}
            />
          }
          label="Add to LL Balance"
          labelPlacement="start"
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
          {...register("addToLLBalance")}
        />
      </DialogContent>
      <DialogActions style={{ margin: 13 }}>
        <Button
          variant="text"
          onClick={() => {
            onCancel();
            reset();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          {row ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </form>
  );
};

export default InvoiceForm;
