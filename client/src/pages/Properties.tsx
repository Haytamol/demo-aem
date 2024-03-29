import { useState } from "react";
import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";
import PropertiesTable from "../components/tables/PropertiesTable";

const Properties = () => {
  const [createRow, setCreateRow] = useState(false);

  return (
    <Box marginX={4} marginBottom={4}>
      <PageHeader
        onClick={() => setCreateRow(true)}
        pageTitle="Properties"
        buttonText="Add Property"
      />
      <PropertiesTable
        createRow={createRow}
        onExitCreateMode={() => setCreateRow(false)}
      />
    </Box>
  );
};

export default Properties;
