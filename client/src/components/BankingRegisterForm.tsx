import { useEffect, useState } from "react";
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
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import "dayjs/locale/en-gb";

import { BankingEntry } from "../hooks/useBankingEntries";
import useProperties from "../hooks/useProperties";
import createDateRanges from "../services/rentalPeriodDropdown";
import debitTypes from "../data/debitTypes";
import creditTypes from "../data/creditTypes";
import useInvoices from "../hooks/useInvoices";

const invoices = ["60641", "103LWTD1", "AEML-221M", "Test Invoice"];

const schema = z.object({
  date: z.string().datetime(),
  type: z
    .string()
    .min(1, { message: "Please select a type: Credit or Debit." }),
  category: z.string().min(1, { message: "The category is required." }),
  property: z.object({
    _id: z
      .string()
      .min(1, { message: "Please select the concerned property." }),
  }),
  invoiceNum: z.string().optional(),
  amount: z.number(),
  rentalPeriod: z
    .string()
    .min(1, { message: "Please select a rental Period." }),
  reference: z.string().optional(),
  toFromAccount: z.string().optional(),
});

interface Props {
  onCreate?: (bankingEntry: BankingEntry) => void;
  onUpdate?: (bankingEntry: BankingEntry, id: string) => void;
  onCancel: () => void;
  row?: MRT_Row<BankingEntry>;
}

const LandlordForm = ({ onUpdate, onCreate, onCancel, row }: Props) => {
  const { properties } = useProperties();
  const [selectedPropertyId, selectProperty] = useState(
    row ? row.original.property._id : ""
  );
  const [rentPeriods, setRentPeriods] = useState<string[]>([]);
  const { invoices } = useInvoices(selectedPropertyId);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BankingEntry>(
    {
      resolver: zodResolver(schema),
      defaultValues: {
        type: row ? row.original.type : "",
      },
    }
    // {
    //  //for logging the submitted data

    //  resolver: (data, context, options) => {
    //   console.log(data);
    //   return zodResolver(schema)(data, context, options);
    // },
    // }
  );

  useEffect(() => {
    const property = properties.find((p) => p._id === selectedPropertyId);
    const rentPeriodStart = property?.landlord?.rentPeriodStart;
    const rentPeriodEnd = property?.landlord?.rentPeriodEnd;
    const contractStartDate = property?.landlord?.contractStartDate;

    // Set the rentalPeriods for that property
    if (
      rentPeriodStart !== undefined &&
      rentPeriodEnd !== undefined &&
      contractStartDate !== undefined
    ) {
      setRentPeriods(
        createDateRanges(rentPeriodStart, rentPeriodEnd, contractStartDate)
      );
    }

    // Set the invoices for that property
  }, [selectedPropertyId, properties]);

  const type = watch("type");

  return (
    <form
      noValidate
      onSubmit={handleSubmit((bankingEntry) => {
        const property = properties.find(
          (p) => p._id === bankingEntry.property?._id
        );

        const newEntry = {
          ...bankingEntry,
          property: property
            ? {
                _id: property._id,
                pID: property.pID,
                llID: property.landlord?.llID || "",
                tID: property.tenant?.tID || "",
              }
            : { _id: "", pID: "", llID: "", tID: "" },
        };

        if (row) {
          onUpdate && onUpdate(newEntry, row?.original._id);
        } else {
          onCreate && onCreate(newEntry);
        }

        reset();
      })}
    >
      <DialogTitle sx={{ fontSize: 18 }}>
        {row ? "Edit" : "Add"} Banking Entry
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

        <TextField
          id="type"
          required
          error={errors.type ? true : false}
          helperText={errors.type?.message}
          select
          label="Type"
          defaultValue={row ? row.original.type : ""}
          {...register("type")}
        >
          <MenuItem value={""}></MenuItem>
          <MenuItem value={"Debit"}>Debit</MenuItem>
          <MenuItem value={"Credit"}>Credit</MenuItem>
        </TextField>

        {creditTypes.length && debitTypes.length && type == "Credit" ? (
          <TextField
            required
            error={errors.category ? true : false}
            helperText={errors.category?.message}
            select
            id="category"
            label="Credit Type"
            defaultValue={row ? row.original.category : ""}
            {...register("category")}
          >
            {creditTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            id="category"
            required
            error={errors.category ? true : false}
            helperText={errors.category?.message}
            select
            label="Debit Type"
            defaultValue={row ? row.original.category : ""}
            {...register("category")}
          >
            {debitTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        )}

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
          error={errors.invoiceNum ? true : false}
          select
          label="Invoice Number"
          defaultValue={row ? row.original.invoiceNum : ""}
          {...register("invoiceNum")}
        >
          <MenuItem value=""></MenuItem>
          {invoices.map((i) => (
            <MenuItem key={i._id} value={i.invNum}>
              {i.invNum}
            </MenuItem>
          ))}
        </TextField>

        {type == "Credit" ? (
          <FormControl variant="standard">
            <InputLabel>Credit Amount</InputLabel>
            <Input
              id="creditAmount"
              required
              error={errors.amount ? true : false}
              startAdornment={
                <InputAdornment position="start">£</InputAdornment>
              }
              defaultValue={row ? row.original.amount : 0}
              {...register("amount", { valueAsNumber: true })}
            />
          </FormControl>
        ) : (
          <FormControl variant="standard">
            <InputLabel>Debit Amount</InputLabel>
            <Input
              id="debitAmount"
              required
              error={errors.amount ? true : false}
              startAdornment={
                <InputAdornment position="start">£</InputAdornment>
              }
              defaultValue={row ? row.original.amount : 0}
              {...register("amount", { valueAsNumber: true })}
            />
          </FormControl>
        )}

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
          id="reference"
          label="Reference"
          variant="standard"
          defaultValue={row ? row.original.reference : ""}
          {...register("reference")}
        />
        <TextField
          id="toFromAccount"
          label="To/From Account"
          variant="standard"
          defaultValue={row ? row.original.toFromAccount : ""}
          {...register("toFromAccount")}
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

export default LandlordForm;
