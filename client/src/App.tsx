import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import SideBar2 from "./components/SideBar";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import BankingRegister from "./pages/BankingRegister";
import InvoiceRegister from "./pages/InvoiceRegister";
import Landlords from "./pages/Landlords";
import LLBalanceSheet from "./pages/LLBalanceSheet";
import Properties from "./pages/Properties";
import TenantBalanceSheet from "./pages/TenantBalanceSheet";
import Tenants from "./pages/Tenants";
import TopBar from "./components/TopBar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const { theme, colorMode } = useMode();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app" style={{ display: "flex", height: "100vh" }}>
            <Router>
              <TopBar />
              <SideBar2 />
              <div style={{ flex: 1, overflowY: "auto", marginTop: 60 }}>
                <Routes>
                  <Route path="/" element={<Properties />} />
                  <Route path="/landlords" element={<Landlords />} />
                  <Route path="/tenants" element={<Tenants />} />
                  <Route
                    path="/bankingRegister"
                    element={<BankingRegister />}
                  />
                  <Route
                    path="/invoiceRegister"
                    element={<InvoiceRegister />}
                  />
                  <Route path="/llBalanceSheet" element={<LLBalanceSheet />} />
                  <Route
                    path="/tenantBalanceSheet"
                    element={<TenantBalanceSheet />}
                  />
                </Routes>
              </div>
            </Router>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </LocalizationProvider>
  );
}

export default App;
