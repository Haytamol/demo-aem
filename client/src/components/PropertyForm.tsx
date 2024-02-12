import { type MRT_Row } from "material-react-table";

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useLandlords from "../hooks/useLandlords";
import { Property } from "../hooks/useProperties";
import useTenants from "../hooks/useTenants";

const schema = z.object({
  pID: z
    .string()
    .refine((data) => data.trim().length > 0, {
      message: "P-ID is required.",
    })
    .refine((data) => data.trim().length >= 2, {
      message: "P-ID must be at least 2 characters.",
    }),
  address: z
    .string()
    .refine((data) => data.trim().length > 0, {
      message: "The property's address is required.",
    })
    .refine((data) => data.trim().length >= 2, {
      message: "The adress must be at least 2 characters.",
    }),
  postCode: z.string(),
  landlord: z.object({
    _id: z.string(),
  }),
  tenant: z.object({
    _id: z.string(),
  }),
});

interface Props {
  onCreate?: (property: Property) => void;
  onUpdate?: (property: Property, id: string) => void;
  onCancel: () => void;
  row?: MRT_Row<Property>; // Row optional for new properties
}

const PropertyForm = ({ onUpdate, onCreate, onCancel, row }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Property>({
    resolver: zodResolver(schema),
  });

  const { landlords } = useLandlords();
  const { tenants } = useTenants();

  return (
    <form
      noValidate
      onSubmit={handleSubmit((property) => {
        const landlord = landlords.find(
          (ll) => ll._id === property.landlord?._id
        );
        const tenant = tenants.find((t) => t._id === property.tenant?._id);

        const newProperty = {
          ...property,
          landlord: landlord
            ? { _id: landlord?._id, llID: landlord?.llID }
            : { _id: "", llID: "" },
          tenant: tenant
            ? { _id: tenant?._id, tID: tenant?.tID }
            : { _id: "", tID: "" },
        };

        if (row) {
          onUpdate && onUpdate(newProperty, row?.original._id);
        } else {
          onCreate && onCreate(newProperty);
        }
        // Reset the form to its initial state
        reset();
      })}
    >
      <DialogTitle sx={{ fontSize: 18 }}>
        {row ? "Edit" : "Add"} Property
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <TextField
          required
          error={errors.pID ? true : false}
          helperText={errors.pID?.message}
          id="p-id"
          label="P-ID"
          variant="standard"
          defaultValue={row ? row.original.pID : ""}
          {...register("pID")}
        />
        <TextField
          required
          error={errors.address ? true : false}
          helperText={errors.address?.message}
          id="address"
          label="Address"
          variant="standard"
          defaultValue={row ? row.original.address : ""}
          {...register("address")}
        />
        <TextField
          id="post-code"
          label="Post Code"
          variant="standard"
          defaultValue={row ? row.original.postCode : ""}
          {...register("postCode")}
        />
        {landlords.length && (
          <TextField
            id="ll-id"
            select
            label="LL-ID"
            defaultValue={row ? row.original.landlord?._id : ""}
            {...register("landlord._id")}
          >
            <MenuItem value=""></MenuItem>
            {landlords.map((ll) => (
              <MenuItem key={ll._id} value={ll._id}>
                {ll.llID}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          id="t-id"
          select
          label="T-ID"
          defaultValue={row ? row.original.tenant?._id : ""}
          {...register("tenant._id")}
        >
          <MenuItem value=""></MenuItem>
          {tenants.map((t) => (
            <MenuItem key={t._id} value={t._id}>
              {t.tID}
            </MenuItem>
          ))}
        </TextField>
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

export default PropertyForm;
