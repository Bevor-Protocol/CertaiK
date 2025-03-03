"use client";

import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MetricCard from "@/components/ui/metric-card";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";
import { UserInfoResponseI } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { AppWindowIcon, Check, Copy, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useCertaiBalance } from "@/hooks/useBalances";
import { DollarSign } from "lucide-react";

const CreditsCard = (): JSX.Element => {
  const { credit } = useCertaiBalance();

  return <MetricCard title="Total Credits" Icon={DollarSign} stat={credit.data} />;
};

export default CreditsCard;

export const ApiKeyManagement: React.FC<{ userAuth: UserInfoResponseI["auth"] }> = ({
  userAuth,
}) => {
  const { isCopied, copy } = useCopyToClipboard();
  const { mutateAsync, isPending, data, isSuccess } = useMutation({
    mutationFn: certaikApiAction.generateApiKey,
  });

  const handleSubmit = async (): Promise<void> => {
    if (!userAuth.can_create) return;
    await mutateAsync("user");
  };

  return (
    <div className="border border-gray-800 rounded-md p-4 col-span-2">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-lg font-medium">API Key Management</p>
          <Key size={16} />
        </div>
        <p className="text-sm text-gray-400">
          {userAuth.exists ? "you have an api key" : "create an api key"}
        </p>
        {!isSuccess ? (
          <Button
            variant="transparent"
            disabled={!userAuth.can_create || isPending}
            className="px-5 w-fit mt-4 h-8"
            onClick={handleSubmit}
          >
            {isPending
              ? "generating..."
              : userAuth.exists
                ? "regenerate api key"
                : "generate api key"}
          </Button>
        ) : (
          <div
            className={cn(
              "flex items-center gap-2 mt-4 h-8 px-5 bg-gray-900",
              "rounded-md max-w-full overflow-hidden",
            )}
          >
            <code
              className={cn(
                "text-sm font-mono text-gray-300 grow",
                "overflow-x-scroll whitespace-nowrap",
              )}
            >
              {data}
            </code>
            <div
              className="p-1 hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
              onClick={() => copy(data)}
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AppManagement: React.FC<{ userApp: UserInfoResponseI["app"] }> = ({ userApp }) => {
  const router = useRouter();
  const { isCopied, copy } = useCopyToClipboard();
  const [appName, setAppName] = useState(userApp.name ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const {
    mutateAsync: generateApiKey,
    data,
    isSuccess,
  } = useMutation({
    mutationFn: certaikApiAction.generateApiKey,
  });
  const { mutateAsync: generateApp } = useMutation({
    mutationFn: certaikApiAction.generateApp,
  });
  const { mutateAsync: updateApp } = useMutation({
    mutationFn: certaikApiAction.updateApp,
  });

  const handleUpsert = async (): Promise<void> => {
    if (!userApp.can_create || !appName) return;
    if (!userApp.exists) {
      await generateApp(appName);
    } else {
      await updateApp(appName);
    }
    router.refresh();
    setIsEditing(false);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!userApp.can_create_auth) return;
    await generateApiKey("app");
  };

  return (
    <div className="border border-gray-800 rounded-md p-4 col-span-2">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-lg font-medium">App Management</p>
          <AppWindowIcon size={16} />
        </div>
        <p className="text-sm text-gray-400">{userApp.exists ? userApp.name : "no app exists"}</p>
        <div className="flex mt-4 items-center gap-4">
          {!userApp.exists && !isEditing && !isSuccess && (
            <Button
              variant="transparent"
              disabled={!userApp.can_create}
              className="px-5 w-fit h-8"
              onClick={() => setIsEditing(true)}
            >
              create app
            </Button>
          )}
          {userApp.exists && !isEditing && !isSuccess && (
            <>
              <Button
                variant="transparent"
                disabled={!userApp.can_create}
                className="px-5 w-fit h-8"
                onClick={() => setIsEditing(true)}
              >
                edit app
              </Button>
              <Button
                variant="transparent"
                disabled={!userApp.can_create}
                className="px-5 w-fit h-8"
                onClick={handleSubmit}
              >
                {userApp.exists_auth ? "regenerate api key" : "generate api key"}
              </Button>
            </>
          )}
          {isEditing && !isSuccess && (
            <>
              <Input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.currentTarget.value)}
                placeholder="App name"
                className="bg-gray-900 rounded px-3 py-1 text-sm"
                disabled={!userApp.can_create}
              />
              <Button
                variant="transparent"
                disabled={!userApp.can_create}
                className="px-5 w-fit h-8"
                onClick={() => handleUpsert()}
              >
                {userApp.exists ? "update" : "create"}
              </Button>
            </>
          )}
          {isSuccess && (
            <div
              className={cn(
                "flex items-center gap-2 h-8 px-5 bg-gray-900",
                "rounded-md max-w-full overflow-hidden",
              )}
            >
              <code
                className={cn(
                  "text-sm font-mono text-gray-300 grow",
                  "overflow-x-scroll whitespace-nowrap",
                )}
              >
                {data}
              </code>
              <div
                className="p-1 hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                onClick={() => copy(data)}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
