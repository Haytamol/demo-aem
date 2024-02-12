import { Box } from "@mui/material";

import BankingRegisterTable from "../components/tables/BankingRegisterTable";
import { initialData } from "../data/bankingEntries";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

const BankingRegister = () => {
  const [createRow, setCreateRow] = useState(false);
  return (
    <Box marginX={4} marginBottom={4}>
      <PageHeader
        onClick={() => setCreateRow(true)}
        pageTitle="Banking Register"
        buttonText="Add New Entry"
      />
      <BankingRegisterTable
        initialData={initialData}
        createRow={createRow}
        onExitCreateMode={() => setCreateRow(false)}
      />
    </Box>
  );
};

export default BankingRegister;
