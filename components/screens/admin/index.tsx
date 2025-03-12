"use client";

import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useState } from "react";

const AdminPanel = (): JSX.Element => {
  const [userSearch, setUserSearch] = useState("");
  const [appSearch, setAppSearch] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingApp, setEditingApp] = useState<string | null>(null);

  const { data: users } = useQuery({
    queryKey: ["users", userSearch],
    queryFn: async () => await certaikApiAction.searchUsers(userSearch),
  });

  const { data: apps } = useQuery({
    queryKey: ["apps", appSearch],
    queryFn: async () => await certaikApiAction.searchApps(appSearch),
  });

  const toggleUserAdmin = async (userId: string): Promise<void> => {
    try {
      // Replace with actual API call when implemented
      await certaikApiAction.updateUserPermissions({
        toUpdateId: userId,
        canCreateApiKey: true,
        canCreateApp: true,
      });
    } catch (error) {
      console.error("Error updating user permissions:", error);
    }
  };

  return (
    <div className="grid gap-6 w-full">
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
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={cn(
                      "border-b border-gray-700 hover:bg-gray-800/50 transition-colors",
                      editingUser === user.id && "bg-gray-800/50",
                    )}
                  >
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.address}</td>
                    <td className="p-2">
                      <Button
                        variant="transparent"
                        onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                      >
                        <Edit size={16} />
                      </Button>

                      {editingUser === user.id && (
                        <div className="absolute mt-2 p-4 bg-gray-900 rounded-lg shadow-lg z-10">
                          <h3 className="font-bold mb-2">Edit User</h3>
                          <div className="flex flex-col gap-2">
                            <Button variant="transparent" onClick={() => toggleUserAdmin(user.id)}>
                              update permissions
                            </Button>
                          </div>
                        </div>
                      )}
                    </td>
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
                  <th className="text-left p-2">Owner</th>
                  <th className="text-left p-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr
                    key={app.id}
                    className={cn(
                      "border-b border-gray-700 hover:bg-gray-800/50 transition-colors",
                      editingApp === app.id && "bg-gray-800/50",
                    )}
                  >
                    <td className="p-2">{app.id}</td>
                    <td className="p-2">{app.name}</td>
                    <td className="p-2">{app.owner_id}</td>
                    <td className="p-2">{app.type}</td>
                    <td className="p-2">
                      <Button
                        variant="transparent"
                        onClick={() => setEditingApp(editingApp === app.id ? null : app.id)}
                      >
                        <Edit size={16} />
                      </Button>

                      {editingApp === app.id && (
                        <div className="absolute mt-2 p-4 bg-gray-900 rounded-lg shadow-lg z-10">
                          <h3 className="font-bold mb-2">Edit App</h3>
                          <div className="flex flex-col gap-2">
                            <Button variant="transparent">Reset API Key</Button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
