"use client";
import Input from "@components/ui/Input";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { getSecurityConfig } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "./Header";
import RoleRow from "./RoleRow";

function AccessPage() {
  const [search, setSearch] = useState("");

  const { data: securityConfig = { roles: {} }, isLoading } = useQuery({
    queryKey: ["securityConfig"],
    queryFn: getSecurityConfig,
  });

  const handleRoleUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["securityConfig"] });
  };

  return (
    <div className="p-4">
      <Header />
      <div className="mb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roles..."
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3}>Loading...</TableCell>
            </TableRow>
          ) : (
            Object.entries(securityConfig.roles)
              .filter(([roleName]) =>
                roleName.toLowerCase().includes(search.toLowerCase())
              )
              .map(([roleName, roleData]) => (
                <RoleRow
                  key={roleName}
                  roleName={roleName}
                  roleMetadata={roleData}
                />
              ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AccessPage;
