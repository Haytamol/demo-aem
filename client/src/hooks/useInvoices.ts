import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import create from "../services/http-service";

export type Invoice = {
  _id: string;
  date: string;
  invNum: string;
  property: {
    _id: string;
    pID: string;
    llID: string;
    tID: string;
  };
  rentalPeriod: string;
  supplier: string;
  category: string;
  description?: string;
  amount: number;
  paymentStatus?: string;
  dateAgentPaidInvoice?: string;
  addToLLBalance?: boolean;
  paidByTenant?: boolean;
  RCND?: boolean;
  paidAmount?: number;
  paidAmountByTenant?: number;
};

// Use the frontend interface as a base for the backend interface
export type FetchedInvoice = Omit<Invoice, "property"> & {
  property: {
    _id: string;
    pID: string;
    landlord: {
      llID: string;
    };
    tenant: {
      tID: string;
    };
  };
};

export const invoiceService = create("/invoices");
const invoicesByPropertyService = create("/invoices/byProperty");

const useInvoices = (propertyId?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let service = propertyId
      ? invoicesByPropertyService.getAllByProperty<FetchedInvoice>(propertyId)
      : invoiceService.getAll<FetchedInvoice>();

    const { request, cancel } = service;

    request
      .then((res) => {
        console.log("Invoices arrived:", res.data);
        let formattedInvoices = res.data.map(formatInvoice);

        setInvoices(formattedInvoices);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, [propertyId]);

  return {
    invoices,
    error,
    isLoading,
    setInvoices,
    setError,
  };
};

// REFACTOR: This function is used also in the banking register
export function formatInvoice(entry: FetchedInvoice) {
  const { property, ...otherFields } = entry;
  const { landlord, tenant, ...propertyFields } = property;

  return {
    ...otherFields,
    property: {
      ...propertyFields,
      llID: landlord ? landlord?.llID : "",
      tID: tenant ? tenant?.tID : "",
    },
  };
}

export default useInvoices;
