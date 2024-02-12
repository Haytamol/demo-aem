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

import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { Tenant } from "../hooks/useTenants";

const schema = z.object({
  tID: z.string().min(2, { message: "T-ID must be at least 2 characters" }),
  name: z.string().min(1, { message: "The tenant's name is required" }),
  rentAmount: z.number().optional(),
  rentStart: z.string().datetime().optional(),
  rentEnd: z.string().datetime().optional(),
  contractStartDate: z.string().datetime().optional(),
  tenantRealStartDate: z.string().datetime().optional(),
});

interface Props {
  onCreate?: (tenant: Tenant) => void;
  onUpdate?: (tenant: Tenant, id: string) => void;
  onCancel: () => void;
  row?: MRT_Row<Tenant>;
}

const TenantForm = ({ onUpdate, onCreate, onCancel, row }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Tenant>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit((tenant) => {
        if (row) {
          onUpdate && onUpdate(tenant, row?.original._id);
        } else {
          onCreate && onCreate(tenant);
        }
        // Reset the form to its initial state
        reset();
      })}
    >
      <DialogTitle sx={{ fontSize: 18 }}>
        {row ? "Edit" : "Add"} Tenant
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <TextField
          required
          error={errors.tID ? true : false}
          helperText={errors.tID?.message}
          id="t-id"
          label="T-ID"
          variant="standard"
          defaultValue={row ? row.original.tID : ""}
          {...register("tID")}
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
          name="tenantRealStartDate"
          defaultValue={
            row
              ? dayjs(row.original.tenantRealStartDate).toISOString()
              : undefined
          }
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label="Real Start Date"
              views={["year", "month", "day"]}
              onChange={(date) => {
                onChange(dayjs(date).toISOString());
              }}
              value={value ? dayjs(value) : null}
              slotProps={{
                textField: {
                  helperText: errors.tenantRealStartDate?.message,
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

export default TenantForm;
