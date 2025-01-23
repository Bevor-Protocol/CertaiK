"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DropdownOption } from "@/utils/types";
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

const AuditsSearch = () => {
  const router = useRouter();
  const [auditTypesSelected, setAuditTypesSelected] = useState<DropdownOption[]>([]);
  const [networkTypesSelected, setNetworkTypesSelected] = useState<DropdownOption[]>([]);

  const submitHandler = () => {
    const search = new URLSearchParams();
    if (auditTypesSelected.length) {
      const params = auditTypesSelected.map((audit) => audit.value);
      search.append("audit_type", params.join(","));
    }
    if (networkTypesSelected.length) {
      const params = networkTypesSelected.map((audit) => audit.value);
      search.append("network", params.join(","));
    }

    router.push(`/analytics/history?${search.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 basis-1">
      <Input
        type="text"
        placeholder="User address..."
        className="bg-gray-900 rounded px-3 py-2 text-sm flex-1"
      />
      <Input
        type="text"
        placeholder="Contract address..."
        className="bg-gray-900 rounded px-3 py-2 text-sm flex-1"
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
      <Button variant="bright" className="mt-auto" onClick={submitHandler}>
        Search
      </Button>
    </div>
  );
};

export default AuditsSearch;
