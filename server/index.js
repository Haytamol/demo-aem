const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const properties = require("./routes/properties");
const landlords = require("./routes/landlords");
const tenants = require("./routes/tenants");
const bankingEntries = require("./routes/bankingEntries");
const llBalanceEntries = require("./routes/llBalanceEntries");
const tenantBalanceEntries = require("./routes/tenantBalanceEntries");
const invoices = require("./routes/invoices");

mongoose
  .connect("mongodb://localhost/pp-playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(cors());
app.use(express.json());
app.use("/api/properties", properties);
app.use("/api/landlords", landlords);
app.use("/api/tenants", tenants);
app.use("/api/bankingEntries", bankingEntries);
app.use("/api/llBalanceEntries", llBalanceEntries.router);
app.use("/api/tenantBalanceEntries", tenantBalanceEntries.router);
app.use("/api/invoices", invoices.router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
