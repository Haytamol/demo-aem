import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import create from "../services/http-service";

export type Property = {
  _id: string;
  pID: string;
  address: string;
  postCode: string;
  landlord?: {
    _id: string | undefined;
    llID: string | undefined;
    rentPeriodStart?: string;
    rentPeriodEnd?: string;
    contractStartDate?: string;
    rentAmount?: number;
    name?: string;
  };
  tenant?: {
    _id: string | undefined;
    tID: string | undefined;
    name?: string;
    rentAmount?: number;
  };
};

export const propertyService = create("/properties");

const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = propertyService.getAll<Property>();
    request
      .then((res) => {
        const formattedProperties = res.data.map(formatProperty);
        setProperties(formattedProperties);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  return { properties, error, isLoading, setProperties, setError };
};

export const useProperty = (propertyId: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = propertyService.get<Property>(propertyId);

    request
      .then((res) => {
        const formattedProperty = formatProperty(res.data);
        console.log("formatted property here", formattedProperty);

        setProperty(formattedProperty);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, [propertyId]);

  return { property, error, isLoading, setProperty, setError };
};

// Handle undefined landlords & tenants
function formatProperty(p: Property) {
  return {
    ...p,
    landlord: p.landlord ? p.landlord : { _id: "", llID: "" },
    tenant: p.tenant ? p.tenant : { _id: "", tID: "" },
  };
}

export default useProperties;
