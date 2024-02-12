import { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import PageHeader from "../components/PageHeader";
import TenantBSTable from "../components/tables/TenantBSTable";
import useTenantBalanceEntries, {
  TenantBalanceEntry,
} from "../hooks/useTenantBalanceEntries";
import useProperties, { Property } from "../hooks/useProperties";
import tenantBSTypes from "../data/tenantBSTypes";

const dateRanges = ["Last Month", "Last 3 Months", "Last 6 Months"];

const tenantBalanceSheet = () => {
  const { properties } = useProperties();
  const [selectedProperty, setProperty] = useState<Property>({
    _id: "",
    pID: "",
    address: "",
    postCode: "",
  });
  const [type, setType] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const { tenantBalanceEntries: data, isLoading } = useTenantBalanceEntries(
    selectedProperty._id
  );
  const [filteredData, setFilteredData] = useState<TenantBalanceEntry[]>([]);

  useEffect(() => {
    let startDate = new Date();
    let endDate = new Date();

    // Calculate start date based on selected dateRange
    switch (dateRange) {
      case "Last Month":
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "Last 3 Months":
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "Last 6 Months":
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      default:
        startDate = new Date(0); // Set to a distant past date
        break;
    }

    // Filter data based on date range
    const filteredByDate = data.filter(
      (entry) =>
        new Date(entry.date) >= startDate && new Date(entry.date) <= endDate
    );

    // Filter data based on type
    const filteredByType =
      type !== "All"
        ? filteredByDate.filter((p) => p.type === type)
        : filteredByDate;

    setFilteredData(filteredByType);
  }, [selectedProperty, type, dateRange, isLoading]);

  const handlePropertyChange = (e: SelectChangeEvent) => {
    const id = e.target.value;
    const property = properties.find((p) => p._id === id);
    setProperty(property as Property);
  };

  // TODO: Refactor Code - Showing info related to balance
  return (
    <Box marginX={4} marginBottom={4}>
      <PageHeader
        pageTitle={`${
          selectedProperty.tenant?.name || "Tenant"
        }'s Balance Sheet`}
        buttonText="Generate Statement"
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", mb: 0.5 }}>
            <Typography sx={{ fontWeight: "bold", marginRight: 0.5 }}>
              Property Address:
            </Typography>
            <Typography>{selectedProperty?.address}</Typography>
          </Box>
          <Box sx={{ display: "flex", mb: 0.5 }}>
            <Typography sx={{ fontWeight: "bold", marginRight: 0.5 }}>
              T-ID:
            </Typography>
            <Typography>{selectedProperty.tenant?.tID}</Typography>
          </Box>
          <Box sx={{ display: "flex", mb: 0.5 }}>
            <Typography sx={{ fontWeight: "bold", marginRight: 0.5 }}>
              Agreed Rent PCM:
            </Typography>
            <Typography>£{selectedProperty.tenant?.rentAmount}</Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: "flex", mb: 0.5 }}>
            <Typography sx={{ fontWeight: "bold", marginRight: 0.5 }}>
              Contract Start Date:
            </Typography>
            <Typography>
              {selectedProperty.landlord?.contractStartDate &&
                new Date(
                  selectedProperty.landlord.contractStartDate
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", mb: 0.5 }}>
            <Typography sx={{ fontWeight: "bold", marginRight: 0.5 }}>
              Payment Day:
            </Typography>
            <Typography>{`to Add`}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="property-label">Property</InputLabel>
            <Select
              labelId="property-label"
              value={selectedProperty?._id}
              onChange={handlePropertyChange}
              label="Property"
            >
              {properties.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.pID}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="type-label">Show Only</InputLabel>
            <Select
              labelId="type-label"
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Type"
            >
              <MenuItem value="All">All</MenuItem>
              {tenantBSTypes.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="date-range-label">Back Period</InputLabel>
            <Select
              labelId="date-range-label"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="dateRange"
            >
              <MenuItem value="All">All</MenuItem>
              {dateRanges.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <TenantBSTable data={filteredData} />
    </Box>
  );
};

export default tenantBalanceSheet;
