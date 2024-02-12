import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import create from "../services/http-service";

export type Landlord = {
  _id: string;
  llID: string;
  name: string;
  property: {
    pID: string;
    address: string;
  };
  rentAmount: number;
  rentPeriodStart: string;
  rentPeriodEnd: string;
  rentPeriod: string;
  contractStartDate: string;
  rentBalanceOwed: number;
  deposit: number;
  expensesNotChargedToLL: number;
};

export const landlordService = create("/landlords");

const useLandlords = () => {
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = landlordService.getAll<Landlord>();
    request
      .then((res) => {
        // Add rentPeriod
        const formattedLandlords = formatLandlords(res.data);
        setLandlords(formattedLandlords);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  return { landlords, error, isLoading, setLandlords, setError };
};

function formatLandlords(data: Landlord[]) {
  return data.map((l) => {
    return formatLandlord(l);
  });
}

export function formatLandlord(l: Landlord) {
  if (!l.rentPeriodStart || !l.rentPeriodEnd) {
    return { ...l, rentPeriod: "" };
  }

  const startDate = new Date(l.rentPeriodStart);
  const endDate = new Date(l.rentPeriodEnd);

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

  return { ...l, rentPeriod: `${formattedStartDate} - ${formattedEndDate}` };
}

export default useLandlords;
