import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import create from "../services/http-service";

export type TenantBalanceEntry = {
  id: string;
  property: {
    _id: string;
    pID: string;
    address: string;
    contractStartDate: string;
    tID: string;
    rentAmount: number;
  };
  type: string;
  date: string;
  rentalPeriod: string;
  rentDue: number;
  rentPaidByTenant: number;
  rentalPeriodBalance?: number;
  runningBalance?: number;
  status?: string;
};

// Use the frontend interface as a base for the backend interface
export type FetchedEntry = Omit<TenantBalanceEntry, "property"> & {
  property: {
    _id: string;
    pID: string;
    address: string;
    tenant: {
      tID: string;
      rentAmount: number;
    };
    landlord: {
      contractStartDate: string;
    };
  };
};

export const tenantBalanceService = create("/tenantBalanceEntries/byProperty");

const useTenantBalanceEntries = (propertyId: string) => {
  const [tenantBalanceEntries, setTenantBalanceEntries] = useState<
    TenantBalanceEntry[]
  >([]);

  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } =
      tenantBalanceService.getAllByProperty<FetchedEntry>(propertyId);
    request
      .then((res) => {
        console.log("here we are again", res.data);

        let formattedEntries = res.data.map(formatEntry);
        setTenantBalanceEntries(formattedEntries);
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
    tenantBalanceEntries,
    error,
    isLoading,
    setTenantBalanceEntries,
    setError,
  };
};

export function formatEntry(entry: FetchedEntry) {
  const { property, ...otherFields } = entry;
  const { landlord, tenant, ...propertyFields } = property;

  return {
    ...otherFields,
    property: {
      ...propertyFields,
      tID: tenant ? tenant?.tID : "",
      rentAmount: tenant ? tenant.rentAmount : 0,
      contractStartDate: landlord ? landlord.contractStartDate : "",
    },
  };
}

export default useTenantBalanceEntries;
