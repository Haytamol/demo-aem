import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import create from "../services/http-service";

export type LLBalanceEntry = {
  _id: string;
  property: {
    _id: string;
    pID: string;
    address: string;
    llID: string;
    rentAmount: number;
    contractStartDate: string;
  };
  type: string;
  date: string;
  rentalPeriod: string;
  amountDueToLL: number;
  debitedToLL: number;
  expensesOrInvoices: number;
  rentalPeriodBalance?: number;
  runningBalance?: number;
  hiddenRent?: number;
  source?: string;
};

// Use the frontend interface as a base for the backend interface
export type FetchedEntry = Omit<LLBalanceEntry, "property"> & {
  property: {
    _id: string;
    pID: string;
    address: string;
    landlord: {
      llID: string;
      rentAmount: number;
      contractStartDate: string;
    };
  };
};

export const llBalanceService = create("/llBalanceEntries/byProperty");

const useLLBalanceEntries = (propertyId: string) => {
  const [llBalanceEntries, setLLBalanceEntries] = useState<LLBalanceEntry[]>(
    []
  );

  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } =
      llBalanceService.getAllByProperty<FetchedEntry>(propertyId);
    request
      .then((res) => {
        let formattedEntries = res.data.map(formatEntry);
        formattedEntries = calculateRunningBalance(formattedEntries);
        setLLBalanceEntries(formattedEntries);
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
    llBalanceEntries,
    error,
    isLoading,
    setLLBalanceEntries,
    setError,
  };
};

export function formatEntry(entry: FetchedEntry) {
  const { property, ...otherFields } = entry;
  const { landlord, ...propertyFields } = property;

  return {
    ...otherFields,
    property: {
      ...propertyFields,
      llID: landlord ? landlord?.llID : "",
      rentAmount: landlord ? landlord.rentAmount : 0,
      contractStartDate: landlord ? landlord.contractStartDate : "",
    },
  };
}

// Calculate running balance for each entry in the array
function calculateRunningBalance(entries: LLBalanceEntry[]): LLBalanceEntry[] {
  let runningBalance = 0;

  const entriesWithRunningBalance = entries.map((entry) => {
    if (entry.amountDueToLL && entry.amountDueToLL > 0) {
      runningBalance += entry.amountDueToLL;
    } else if (entry.debitedToLL && entry.debitedToLL > 0) {
      runningBalance -= entry.debitedToLL;
    } else if (entry.expensesOrInvoices && entry.expensesOrInvoices > 0) {
      runningBalance -= entry.expensesOrInvoices;
    }

    // Add runningBalance to the entry
    return {
      ...entry,
      runningBalance,
    };
  });

  return entriesWithRunningBalance;
}

// function calculateRentalPeriodBalance(
//   entries: LLBalanceEntry[]
// ): LLBalanceEntry[] {
//   const rentalPeriodBalancesMap = new Map<string, number>();

//   // Iterate through the entries and calculate running balance for each rental period
//   for (const entry of entries) {
//     if (!entry.rentalPeriod) {
//       // Skip entries without a rentalPeriod
//       continue;
//     }

//     // Calculate the running balance for the current rentalPeriod
//     const runningBalance = rentalPeriodBalancesMap.get(entry.rentalPeriod) || 0;

//     // Adjust the running balance based on the type of entry
//     if (entry.amountDueToLL && entry.amountDueToLL > 0) {
//       rentalPeriodBalancesMap.set(
//         entry.rentalPeriod,
//         runningBalance + entry.amountDueToLL
//       );
//     } else if (entry.debitedToLL && entry.debitedToLL > 0) {
//       rentalPeriodBalancesMap.set(
//         entry.rentalPeriod,
//         runningBalance - entry.debitedToLL
//       );
//     } else if (entry.expensesOrInvoices && entry.expensesOrInvoices > 0) {
//       rentalPeriodBalancesMap.set(
//         entry.rentalPeriod,
//         runningBalance - entry.expensesOrInvoices
//       );
//     }

//     if (entry.rentalPeriodBalance === undefined) {
//       const isFirstEntryForPeriod =
//         entries.findIndex((e) => e.rentalPeriod === entry.rentalPeriod) ===
//         entries.indexOf(entry);
//       console.log(
//         "index of entry",
//         entry.rentalPeriod,
//         "entry",
//         entries.indexOf(entry)
//       );

//       if (isFirstEntryForPeriod) {
//         entry.rentalPeriodBalance = runningBalance;
//       }
//     }
//   }

//   return entries;
// }

export default useLLBalanceEntries;
