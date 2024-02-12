import * as FaIcons from "react-icons/fa6";

export const sideBarData = [
  {
    title: "Properties",
    icon: <FaIcons.FaHouseChimney />,
    path: "/",
    level: 1,
  },
  {
    title: "Landlords",
    icon: <FaIcons.FaUserTie />,
    path: "/landlords",
    level: 1,
  },
  {
    title: "Tenants",
    icon: <FaIcons.FaUsers />,
    path: "/tenants",
    level: 1,
  },
  {
    title: "Banking Register",
    icon: <FaIcons.FaMoneyBillTransfer />,
    path: "/bankingRegister",
    level: 1,
  },
  {
    title: "Invoice Register",
    icon: <FaIcons.FaFileInvoiceDollar />,
    path: "/invoiceRegister",
    level: 1,
  },
  {
    title: "Landlord BS",
    icon: <FaIcons.FaSackDollar />,
    path: "/llBalanceSheet",
    level: 2,
  },
  {
    title: "Tenant BS",
    icon: <FaIcons.FaPiggyBank />,
    path: "/tenantBalanceSheet",
    level: 2,
  },
];
