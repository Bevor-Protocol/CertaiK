"use client";

import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderFull } from "@/components/ui/loader";
import { Select } from "@/components/ui/select";
import { cn, prettyDate } from "@/lib/utils";
import { constructSearchQuery, trimAddress } from "@/utils/helpers";
import { DropdownOption } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export const AuditsSearch = ({ query }: { query?: { [key: string]: string } }) => {
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
    <div className="flex-col gap-4 basis-1 mt-8 hidden md:flex">
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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-data", query],
    queryFn: () => certaikApiAction.getAudits(query || {}),
  });

  if (isError) {
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

  return (
    <div className="flex flex-col flex-grow justify-between overflow-x-hidden">
      <Table results={data?.results ?? []} isLoading={isLoading} isError={isError} />
      <Pagination query={query} data={data} more={data?.more ?? false} isLoading={isLoading} />
    </div>
  );
};

const Table = ({
  results,
  isError,
  isLoading,
}: {
  results: any[];
  isError: boolean;
  isLoading: boolean;
}) => {
  return (
    <div className="flex flex-col flex-grow overflow-x-scroll w-full">
      <div className="grid grid-cols-9 border-gray-800 min-w-[600px] *:text-center *:pb-2 *:text-sm *:md:text-md">
        <div className="col-span-1">#</div>
        <div className="col-span-2">User</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Method</div>
        <div className="col-span-2">Address</div>
        <div className="col-span-1">Network</div>
        <div className="col-span-1">Created</div>
      </div>
      <div className="flex flex-col flex-grow justify-between min-w-[600px]">
        <div className="flex-grow">
          {isLoading && <LoaderFull className="h-12 w-12" />}
          {isError && <p className="text-red-600">something went wrong...</p>}
          {results && !results.length && <p className="">no audits matched this criteria...</p>}
          {results.map((audit) => (
            <Link
              key={audit.id}
              href={`/audit/${audit.id}`}
              className={cn(
                "border-t border-gray-800 hover:bg-gray-900 cursor-pointer block outline-none",
                "appearance-none focus:bg-gray-900 focus-within:bg-gray-900",
              )}
            >
              <div className="w-full grid grid-cols-9 text-xs *:p-2 *:text-center *:whitespace-nowrap">
                <div className="col-span-1">{audit.n + 1}</div>
                <div className="col-span-2">{trimAddress(audit.user_id)}</div>
                <div className="col-span-1">{audit.audit_type}</div>
                <div className="col-span-1">{audit.contract.method}</div>
                <div className="col-span-2">
                  {audit.contract.address ? trimAddress(audit.contract.address) : "N/A"}
                </div>
                <div className="col-span-1">{audit.contract.network || "N/A"}</div>
                <div className="col-span-1">{prettyDate(audit.created_at)}</div>
              </div>
            </Link>
          ))}
          {results.slice(1, 5).map((audit) => (
            <Link
              key={audit.id}
              href={`/audit/${audit.id}`}
              className={cn(
                "border-t border-gray-800 hover:bg-gray-900 cursor-pointer block outline-none",
                "appearance-none focus:bg-gray-900 focus-within:bg-gray-900",
              )}
            >
              <div className="w-full grid grid-cols-9 text-xs *:p-2 *:text-center *:whitespace-nowrap">
                <div className="col-span-1">{audit.n + 1}</div>
                <div className="col-span-2">{trimAddress(audit.user_id)}</div>
                <div className="col-span-1">{audit.audit_type}</div>
                <div className="col-span-1">{audit.contract.method}</div>
                <div className="col-span-2">
                  {audit.contract.address ? trimAddress(audit.contract.address) : "N/A"}
                </div>
                <div className="col-span-1">{audit.contract.network || "N/A"}</div>
                <div className="col-span-1">{prettyDate(audit.created_at)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const Pagination = ({
  query,
  data,
  more,
  isLoading,
}: {
  query: any;
  data: any;
  more: boolean;
  isLoading: boolean;
}) => {
  const page = Number(query?.page || "0");

  const router = useRouter();
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    if (!data) return;
    setTotalPages(data.total_pages);
  }, [data]);
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-4">
        <Button
          disabled={page === 0 || isLoading}
          variant="transparent"
          onClick={() => handlePaginate("prev")}
        >
          ←
        </Button>
        <span className="text-sm text-gray-400">
          Page {page + 1} of {totalPages}
        </span>
        <Button
          disabled={!more || isLoading}
          variant="transparent"
          onClick={() => handlePaginate("next")}
        >
          →
        </Button>
      </div>
    </div>
  );
};
