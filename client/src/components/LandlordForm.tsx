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
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@mui/x-date-pickers";
import { Landlord } from "../hooks/useLandlords";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

const schema = z.object({
  llID: z
    .string()
    .refine((data) => data.trim().length > 0, {
      message: "LL-ID is required.",
    })
    .refine((data) => data.trim().length >= 2, {
      message: "LL-ID must be at least 2 characters.",
    }),
  name: z.string().min(1, { message: "The landlord's name is required" }),
  rentAmount: z.number().optional(),
  rentPeriodStart: z.string().datetime().optional(),
  rentPeriodEnd: z.string().datetime().optional(),
});

interface Props {
  onCreate?: (landlord: Landlord) => void;
  onUpdate?: (landlord: Landlord, id: string) => void;
  onCancel: () => void;
  row?: MRT_Row<Landlord>; // Row optional for new properties
}

const LandlordForm = ({ onUpdate, onCreate, onCancel, row }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Landlord>({
    resolver: zodResolver(schema),
  });

  // Use watch to get the value of "rentPeriodStart" directly
  const rentPeriodStart = watch("rentPeriodStart");

  return (
    <form
      noValidate
      onSubmit={handleSubmit((landlord) => {
        // Add the contractStartDate
        const startDate = new Date(landlord.rentPeriodStart);
        console.log("Rental period start is: ", landlord.rentPeriodStart);

        if (startDate.getDate() > 28) {
          landlord.contractStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            28
          ).toISOString();
        } else {
          landlord.contractStartDate = landlord.rentPeriodStart;
        }

        console.log("updated", landlord);

        if (row) {
          onUpdate && onUpdate(landlord, row?.original._id);
        } else {
          onCreate && onCreate(landlord);
        }
        // Reset the form to its initial state
        reset();
      })}
    >
      <DialogTitle sx={{ fontSize: 18 }}>
        {row ? "Edit" : "Add"} Landlord
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <TextField
          required
          error={errors.llID ? true : false}
          helperText={errors.llID?.message}
          id="ll-id"
          label="LL-ID"
          variant="standard"
          defaultValue={row ? row.original.llID : ""}
          {...register("llID")}
        />
        <TextField
          required
          error={errors.name ? true : false}
          helperText={errors.name?.message}
          id="name"
          label="Name"
          variant="standard"
          defaultValue={row ? row.original.name : ""}
          {...register("name")}
        />
        <FormControl variant="standard">
          <InputLabel htmlFor="standard-adornment-amount">
            Rental Amount
          </InputLabel>
          <Input
            id="rentAmount"
            error={errors.rentAmount ? true : false}
            startAdornment={<InputAdornment position="start">£</InputAdornment>}
            defaultValue={row ? row.original.rentAmount : 0}
            {...register("rentAmount", { valueAsNumber: true })}
          />
        </FormControl>
        <Controller
          control={control}
          name="rentPeriodStart"
          defaultValue={
            row ? dayjs(row.original.rentPeriodStart).toISOString() : undefined
          }
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label="Rental Period Start"
              views={["year", "month", "day"]}
              onChange={(date) => {
                onChange(dayjs(date).toISOString());
              }}
              value={value ? dayjs(value) : null}
              slotProps={{
                textField: {
                  helperText: errors.rentPeriodStart?.message,
                },
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="rentPeriodEnd"
          defaultValue={
            row ? dayjs(row.original.rentPeriodEnd).toISOString() : undefined
          }
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label="Rental Period End"
              views={["year", "month", "day"]}
              onChange={(date) => {
                onChange(dayjs(date).toISOString());
              }}
              value={value ? dayjs(value) : null}
              minDate={dayjs(rentPeriodStart)}
              slotProps={{
                textField: {
                  helperText: errors.rentPeriodEnd?.message,
                },
              }}
            />
          )}
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
