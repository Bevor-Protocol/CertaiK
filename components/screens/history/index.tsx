"use client";

import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadWaifu } from "@/components/ui/loader";
import { Select } from "@/components/ui/select";
import { cn, prettyDate } from "@/lib/utils";
import { constructSearchQuery, trimAddress } from "@/utils/helpers";
import { DropdownOption } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const auditTypeOptions: DropdownOption[] = [
  {
    name: "gas",
    value: "gas",
  },
  {
    name: "security",
    value: "security",
  },
];

const networkOptions: DropdownOption[] = [
  {
    name: "eth mainnet",
    value: "eth",
  },
  {
    name: "bsc",
    value: "bsc",
  },
  {
    name: "polygon",
    value: "polygon",
  },
  {
    name: "sepolia",
    value: "eth_sepolia",
  },
  {
    name: "bsc testnet",
    value: "bsc_test",
  },
  {
    name: "base",
    value: "base",
  },
  {
    name: "polygon testnet",
    value: "polygon_amoy",
  },
  {
    name: "base testnet",
    value: "base_sepolia",
  },
];

const getInitialState = (query: { [key: string]: string }, key: string) => {
  console.log(query, key);
  if (!(key in query)) {
    return [];
  }
  const options = query[key].split(",");
  switch (key) {
    case "network": {
      return networkOptions.filter((network) => options.includes(network.value));
    }
    case "audit_type": {
      return auditTypeOptions.filter((type) => options.includes(type.value));
    }
    default: {
      return [];
    }
  }
};

export const AuditsSearch = ({
  query,
  className,
}: {
  query?: { [key: string]: string };
  className?: string;
}) => {
  const router = useRouter();

  const [auditTypesSelected, setAuditTypesSelected] = useState<DropdownOption[]>(
    getInitialState(query || {}, "audit_type"),
  );
  const [networkTypesSelected, setNetworkTypesSelected] = useState<DropdownOption[]>(
    getInitialState(query || {}, "network"),
  );
  const [address, setAddresss] = useState(query?.user_id ?? "");
  const [contract, setContract] = useState(query?.contract_address ?? "");

  const submitHandler = () => {
    const search = constructSearchQuery({
      audits: auditTypesSelected,
      networks: networkTypesSelected,
      address,
      contract,
      page: query?.page ?? "0",
    });
    router.push(`/analytics/history?${search.toString()}`);
  };

  const resetHandler = () => {
    setAuditTypesSelected([]);
    setNetworkTypesSelected([]);
    setAddresss("");
    setContract("");
    if (query) {
      router.push("/analytics/history");
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 basis-1", className)}>
      <Input
        type="text"
        placeholder="User address..."
        className="bg-gray-900 rounded px-3 py-2 text-sm flex-1"
        value={address}
        onChange={(e) => setAddresss(e.currentTarget.value)}
      />
      <Input
        type="text"
        placeholder="Contract address..."
        className="bg-gray-900 rounded px-3 py-2 text-sm flex-1"
        value={contract}
        onChange={(e) => setContract(e.currentTarget.value)}
      />
      <div className="w-full">
        <Select
          title="audit type"
          options={auditTypeOptions}
          selectedOptions={auditTypesSelected}
          setSelectedOptions={setAuditTypesSelected}
        />
      </div>
      <div className="w-full">
        <Select
          title="network"
          options={networkOptions}
          selectedOptions={networkTypesSelected}
          setSelectedOptions={setNetworkTypesSelected}
        />
      </div>
      <div className="mt-auto space-y-2 w-full *:w-full">
        <Button variant="bright" onClick={submitHandler}>
          Search
        </Button>
        <Button variant="bright" onClick={resetHandler}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export const Content = ({ query }: { query?: { [key: string]: string } }): JSX.Element => {
  const page = Number(query?.page || "0");

  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-data", query],
    queryFn: () => certaikApiAction.getAudits(query || {}),
  });

  if (isLoading) {
    return <LoadWaifu />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-grow justify-center items-center">
        <p className="text-red-600">something went wrong...</p>
      </div>
    );
  }

  if (data && !data.results.length) {
    return (
      <div className="flex flex-grow justify-center items-center">
        <p className="">no audits matched this criteria...</p>
      </div>
    );
  }

  const handlePaginate = (type: "prev" | "next") => {
    const curQuery = constructSearchQuery({
      audits: getInitialState(query || {}, "audit_type"),
      networks: getInitialState(query || {}, "network"),
      address: query?.address ?? "",
      contract: query?.contract_address ?? "",
    });

    curQuery.set("page", (type === "prev" ? page - 1 : page + 1).toString());
    router.push(`/analytics/history?${curQuery.toString()}`);
  };

  return (
    <div className="flex flex-col flex-grow justify-between">
      <div>
        {data.results.map((audit) => (
          <Link
            key={audit.id}
            href={`/audit/${audit.id}`}
            className={cn(
              "border-t border-gray-800 hover:bg-gray-900 cursor-pointer block outline-none",
              "appearance-none focus:bg-gray-900 focus-within:bg-gray-900",
            )}
          >
            <div className="w-full flex *:p-2 *:text-center">
              <div className="basis-[5%]">{audit.n + 1}</div>
              <div className="basis-[25%]">{trimAddress(audit.user_id)}</div>
              <div className="basis-[10%]">{audit.audit_type}</div>
              <div className="basis-[10%]">{audit.contract.method}</div>
              <div className="basis-[25%]">
                {audit.contract.address ? trimAddress(audit.contract.address) : "N/A"}
              </div>
              <div className="basis-[10%]">{audit.contract.network || "N/A"}</div>
              <div className="basis-[15%]">{prettyDate(audit.created_at)}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center pt-4 mt-4">
        <div className="flex items-center gap-4">
          <Button
            disabled={page === 0}
            variant="transparent"
            onClick={() => handlePaginate("prev")}
          >
            ←
          </Button>
          <span className="text-sm text-gray-400">Page {page + 1}</span>
          <Button
            disabled={!data.more}
            variant="transparent"
            onClick={() => handlePaginate("next")}
          >
            →
          </Button>
        </div>
      </div>
    </div>
  );
};
