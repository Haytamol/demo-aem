import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import create from "../services/http-service";

export type Tenant = {
  _id: string;
  tID: string;
  name: string;
  property: {
    pID: string;
    address: string;
  };
  rentAmount: number;
  landlord: {
    rentPeriodStart: string;
    rentPeriodEnd: string;
    rentPeriod: string;
    contractStartDate: string;
  };
  rentPaymentDay: number;
  balance: number;
  tenantRealStartDate: string;
  refundAmount: number;
};

export const tenantService = create("/tenants");

const useTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = tenantService.getAll<Tenant>();
    request
      .then((res) => {
        // Add rentPeriod
        const formattedTenants = formatTenants(res.data);

        setTenants(formattedTenants);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  return {
    tenants,
    error,
    isLoading,
    setTenants,
    setError,
  };
};

function formatTenants(data: Tenant[]) {
  return data.map((t) => {
    return formatTenant(t);
  });
}

export function formatTenant(t: Tenant) {
  const startDate = new Date(t.landlord?.rentPeriodStart);
  const endDate = new Date(t.landlord?.rentPeriodEnd);
  const realStartDate = new Date(t.tenantRealStartDate);

  const formattedStartDate = startDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedEndDate = endDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (!t.landlord?.rentPeriodStart || !t.landlord?.rentPeriodEnd) {
    return { ...t, rentPeriod: "", rentPaymentDay: realStartDate.getDate() };
  }

  return {
    ...t,
    landlord: {
      ...t.landlord,
      rentPeriod: `${formattedStartDate} - ${formattedEndDate}`,
    },
    rentPaymentDay: realStartDate.getDate(),
  };
}

export default useTenants;
