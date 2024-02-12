import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import create from "../services/http-service";

export type BankingEntry = {
  _id: string;
  date: string;
  type: string;
  category: string;
  property: {
    _id: string;
    pID: string;
    llID: string ;
    tID: string;
  };
  invoiceNum: string;
  amount: number;
  rentalPeriod: string;
  reference: string;
  toFromAccount: string;
  runningBalance: number;
  complete: boolean;
  invoiceListed: boolean;
};

// Use the frontend interface as a base for the backend interface
export type FetchedEntry = Omit<BankingEntry, "property"> & {
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

export const bankingService = create("/bankingEntries");

const useBankingEntries = () => {
  const [bankingEntries, setBankingEntries] = useState<BankingEntry[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = bankingService.getAll<FetchedEntry>();
    request
      .then((res) => {
        // Format to get tID and llID

        let formattedEntries = res.data.map(formatEntry);

        // Add running balance
        formattedEntries = calculateRunningBalance(formattedEntries);

        setBankingEntries(formattedEntries);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  return { bankingEntries, error, isLoading, setBankingEntries, setError };
};

export function formatEntry(entry: FetchedEntry) {
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

// Calculate running balance for each entry in the array
export function calculateRunningBalance(entries: BankingEntry[]) {
  const sortedEntries = entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningBalance = 0;

  return sortedEntries.map((entry) => {
    if (entry.type === "Credit") runningBalance += entry.amount;
    else runningBalance -= entry.amount;
    return { ...entry, runningBalance };
  });
}

export default useBankingEntries;
