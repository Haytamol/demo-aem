import { useState } from "react";
import TenantsTable from "../components/tables/TenantsTable";
import { initialData } from "../data/tenants";
import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";

const Tenants = () => {
  const [createRow, setCreateRow] = useState(false);
  return (
    <Box marginX={4} marginBottom={4}>
      <PageHeader
        onClick={() => setCreateRow(true)}
        pageTitle="Tenants"
        buttonText="Add Tenant"
      />
      <TenantsTable
        initialData={initialData}
        createRow={createRow}
        onExitCreateMode={() => setCreateRow(false)}
      />
    </Box>
  );
};

export default Tenants;
