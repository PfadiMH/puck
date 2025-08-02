"use client";
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
import { useSession } from "next-auth/react";
import { useState } from "react";
import Header from "./Header";
import RoleRow from "./RoleRow";

function AccessPage() {
  const session = useSession().data;
  const [open, setOpen] = useState(false);

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
            Object.entries(securityConfig.roles).map(([roleName, roleData]) => (
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
