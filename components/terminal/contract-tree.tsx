import { cn } from "@/lib/utils";
import { TreeResponseI } from "@/utils/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ContractTreeProps {
  tree: TreeResponseI;
  selectedContracts: string[];
  onContractSelect: (contractId: string) => void;
  className?: string;
}

const ContractTree = ({
  tree,
  selectedContracts,
  onContractSelect,
  className,
}: ContractTreeProps): JSX.Element => {
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const toggleSource = (sourcePath: string): void => {
    setExpandedSources((prev) => ({
      ...prev,
      [sourcePath]: !prev[sourcePath],
    }));
  };

  return (
    <div className={cn("font-mono text-sm", className)}>
      {tree.sources.map((source) => {
        const isExpanded = expandedSources[source.path] ?? false;
        return (
          <div key={source.path} className="mb-2">
            <div
              className="flex items-center cursor-pointer hover:text-blue-300"
              onClick={() => toggleSource(source.path)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1" />
              )}
              <span className="text-blue-400">{source.path}</span>
            </div>
            {isExpanded && (
              <div className="ml-6 mt-1 space-y-1">
                {source.contracts.map((contract) => {
                  const isSelected = selectedContracts.includes(contract.id);
                  return (
                    <div
                      key={contract.id}
                      className={cn(
                        "flex items-center cursor-pointer px-2 py-1 rounded",
                        "hover:bg-gray-700/50",
                        isSelected && "bg-gray-700/50",
                      )}
                      onClick={() => onContractSelect(contract.id)}
                    >
                      <span className={cn("text-white", isSelected && "text-green-400")}>
                        {contract.name}
                      </span>
                      <span className="ml-2 text-gray-400 text-xs">({contract.kind})</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContractTree;
