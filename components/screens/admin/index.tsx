"use client";

import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AppSearchResponseI, UserSearchResponseI } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useState } from "react";

const AdminPanel = (): JSX.Element => {
  const queryClient = useQueryClient();
  const [userSearch, setUserSearch] = useState("");
  const [appSearch, setAppSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserSearchResponseI | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppSearchResponseI | null>(null);

  const { data: users } = useQuery({
    queryKey: ["users", userSearch],
    queryFn: async () => await certaikApiAction.searchUsers(userSearch),
  });

  const { data: apps } = useQuery({
    queryKey: ["apps", appSearch],
    queryFn: async () => await certaikApiAction.searchApps(appSearch),
  });

  const { mutate: updateUserPermissions, isPending: userPending } = useMutation({
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ["users", userSearch] }),
    mutationFn: ({
      toUpdateId,
      canCreateApp,
      canCreateApiKey,
    }: {
      toUpdateId: string;
      canCreateApp: boolean;
      canCreateApiKey: boolean;
    }) =>
      certaikApiAction.updateUserPermissions({
        toUpdateId,
        canCreateApp,
        canCreateApiKey,
      }),
  });

  const { mutate: updateAppPermissions, isPending: appPending } = useMutation({
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ["apps", appSearch] }),
    mutationFn: ({
      toUpdateId,
      canCreateApp,
      canCreateApiKey,
    }: {
      toUpdateId: string;
      canCreateApp: boolean;
      canCreateApiKey: boolean;
    }) =>
      certaikApiAction.updateAppPermissions({
        toUpdateId,
        canCreateApp,
        canCreateApiKey,
      }),
  });

  const handleSelect = ({
    app,
    user,
  }: {
    user?: UserSearchResponseI;
    app?: AppSearchResponseI;
  }): void => {
    if (app) {
      setSelectedUser(null);
      setSelectedApp(app);
    }
    if (user) {
      setSelectedUser(user);
      setSelectedApp(null);
    }
  };

  const handleClose = (): void => {
    setSelectedApp(null);
    setSelectedUser(null);
  };

  return (
    <div className="grid gap-6 w-full relative">
      <div className="bg-black/90 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search by address or ID"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="flex-1"
          />
        </div>

        {users && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Address</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={cn(
                      "border-b border-gray-700 hover:bg-gray-800/50",
                      "transition-colors cursor-pointer",
                    )}
                    onClick={() => handleSelect({ user })}
                  >
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-black/90 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">App Management</h2>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search by app name or ID"
            value={appSearch}
            onChange={(e) => setAppSearch(e.target.value)}
            className="flex-1"
          />
        </div>

        {apps && apps.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Owner ID</th>
                  <th className="text-left p-2">Type</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {apps.map((app) => (
                  <tr
                    key={app.id}
                    className={cn(
                      "border-b border-gray-700 hover:bg-gray-800/50",
                      "transition-colors cursor-pointer",
                    )}
                    onClick={() => handleSelect({ app })}
                  >
                    <td className="p-2">{app.id}</td>
                    <td className="p-2">{app.name}</td>
                    <td className="p-2">{app.owner_id}</td>
                    <td className="p-2">{app.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden",
          (!!selectedApp || !!selectedUser) && "block",
        )}
      >
        {selectedApp && (
          <AppPermission
            app={selectedApp}
            handleClose={handleClose}
            handleUpdate={(data) => {
              handleClose();
              updateAppPermissions(data);
            }}
            isLoading={appPending}
          />
        )}
        {selectedUser && (
          <UserPermission
            user={selectedUser}
            handleClose={handleClose}
            handleUpdate={(data) => {
              handleClose();
              updateUserPermissions(data);
            }}
            isLoading={userPending}
          />
        )}
      </div>
    </div>
  );
};

const UserPermission = ({
  user,
  handleClose,
  handleUpdate,
  isLoading,
}: {
  user: UserSearchResponseI;
  isLoading: boolean;
  handleClose: () => void;
  handleUpdate: ({
    toUpdateId,
    canCreateApp,
    canCreateApiKey,
  }: {
    toUpdateId: string;
    canCreateApp: boolean;
    canCreateApiKey: boolean;
  }) => void;
}): JSX.Element => {
  const [permission, setPermission] = useState(user.permission);

  const handleSave = (): void => {
    if (permission === null || permission === undefined) return;
    handleUpdate({
      toUpdateId: user.id,
      canCreateApiKey: permission.can_create_api_key,
      canCreateApp: permission.can_create_app,
    });
  };

  return (
    <div className="bg-black/90 p-6 rounded-lg shadow-lg w-96 border border-gray-600">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-white cursor-pointer"
        onClick={handleClose}
      >
        <XIcon className="h-5 w-5" />
      </button>

      <h2 className="text-xl font-bold mb-4">User Details</h2>

      <div className="space-y-4">
        <div className="text-sm">
          <p className="text-gray-400">ID</p>
          <p className="font-medium">{user.id}</p>
        </div>
        <div className="text-sm">
          <p className="text-gray-400">Address</p>
          <p className="font-medium truncate">{user.address}</p>
        </div>
        <div className="pt-4 border-t border-gray-700">
          {!user.permission ? (
            <h3 className="font-semibold mb-3">No Auth</h3>
          ) : (
            <>
              <h3 className="font-semibold mb-3">Permissions</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="canCreateApp" className="text-sm">
                    Can Create App
                  </label>
                  <Switch
                    id="canCreateApp"
                    checked={permission?.can_create_app}
                    onCheckedChange={(checked: boolean) =>
                      setPermission((prev) =>
                        prev
                          ? { ...prev, can_create_app: checked }
                          : { can_create_app: checked, can_create_api_key: false },
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="canCreateApiKey" className="text-sm">
                    Can Create API Key
                  </label>
                  <Switch
                    id="canCreateApiKey"
                    checked={permission?.can_create_api_key}
                    onCheckedChange={(checked: boolean) =>
                      setPermission((prev) =>
                        prev
                          ? { ...prev, can_create_api_key: checked }
                          : { can_create_app: false, can_create_api_key: checked },
                      )
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
        {!!user.permission && (
          <Button
            variant="bright"
            className="w-full mt-4"
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Permissions
          </Button>
        )}
      </div>
    </div>
  );
};

const AppPermission = ({
  app,
  handleClose,
  handleUpdate,
  isLoading,
}: {
  app: AppSearchResponseI;
  isLoading: boolean;
  handleClose: () => void;
  handleUpdate: ({
    toUpdateId,
    canCreateApp,
    canCreateApiKey,
  }: {
    toUpdateId: string;
    canCreateApp: boolean;
    canCreateApiKey: boolean;
  }) => void;
}): JSX.Element => {
  const [permission, setPermission] = useState(app.permission);

  const handleSave = (): void => {
    if (permission === null || permission === undefined) return;
    handleUpdate({
      toUpdateId: app.id,
      canCreateApiKey: permission.can_create_api_key,
      canCreateApp: permission.can_create_app,
    });
  };

  return (
    <div className="bg-black/90 p-6 rounded-lg shadow-lg w-96 transform">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-white cursor-pointer"
        onClick={handleClose}
      >
        <XIcon className="h-5 w-5" />
      </button>

      <h2 className="text-xl font-bold mb-4">App Details</h2>

      <div className="space-y-4">
        <div className="text-sm">
          <p className="text-gray-400">ID</p>
          <p className="font-medium">{app.id}</p>
        </div>
        <div className="text-sm">
          <p className="text-gray-400">Name</p>
          <p className="font-medium truncate">{app.name}</p>
        </div>
        <div className="text-sm">
          <p className="text-gray-400">App Type</p>
          <p className="font-medium truncate">{app.type}</p>
        </div>
        <div className="text-sm">
          <p className="text-gray-400">Owner ID</p>
          <p className="font-medium truncate">{app.owner_id}</p>
        </div>
        <div className="pt-4 border-t border-gray-700">
          {!app.permission ? (
            <h3 className="font-semibold mb-3">No Auth</h3>
          ) : (
            <>
              <h3 className="font-semibold mb-3">Permissions</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="canCreateApiKey" className="text-sm">
                    Can Create API Key
                  </label>
                  <Switch
                    id="canCreateApiKey"
                    checked={permission?.can_create_api_key}
                    onCheckedChange={(checked: boolean) =>
                      setPermission((prev) =>
                        prev
                          ? { ...prev, can_create_api_key: checked }
                          : { can_create_app: false, can_create_api_key: checked },
                      )
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
        {!!app.permission && (
          <Button
            variant="bright"
            className="w-full mt-4"
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Permissions
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
