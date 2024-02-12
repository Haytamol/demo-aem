import { useState } from "react";

import { Box } from "@mui/material";

import LandlordsTable from "../components/tables/LandlordsTable";
import { initialData } from "../data/landlords";
import PageHeader from "../components/PageHeader";

const Landlords = () => {
  const [createRow, setCreateRow] = useState(false);
  return (
    <Box marginX={4} marginBottom={4}>
      <PageHeader
        onClick={() => setCreateRow(true)}
        pageTitle="Landlords"
        buttonText="Add Landlord"
      />
      <LandlordsTable
        initialData={initialData}
        createRow={createRow}
        onExitCreateMode={() => setCreateRow(false)}
      />
    </Box>
  );
};

export default Landlords;
