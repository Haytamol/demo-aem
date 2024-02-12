import { useState } from "react";
import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";
import InvoiceRegisterTable from "../components/tables/InvoiceRegisterTable";

const InvoiceRegister = () => {
  const [createRow, setCreateRow] = useState(false);

  return (
    <Box marginX={4} marginBottom={4}>
      <PageHeader
        onClick={() => setCreateRow(true)}
        pageTitle="Invoice Register"
        buttonText="Add New Invoice"
      />
      <InvoiceRegisterTable
        createRow={createRow}
        onExitCreateMode={() => setCreateRow(false)}
      />
    </Box>
  );
};

export default InvoiceRegister;
