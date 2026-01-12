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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "./Header";
import RoleRow from "./RoleRow";

function SecurityManager() {
  const [search, setSearch] = useState("");

  const { data: securityConfig, isLoading } = useQuery({
    queryKey: ["securityConfig"],
    queryFn: getSecurityConfig,
  });

  const filteredRoles = securityConfig
    ? securityConfig.roles.filter((role) =>
      role.name.toLowerCase().includes(search.toLowerCase())
    )
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <Header />

      <div className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-primary/60 group-focus-within:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roles by name..."
          className="w-full pl-10 bg-elevated/30 border-primary/20 focus:border-primary/60"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-elevated/10 rounded-xl border border-primary/10 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-primary/10">
              <TableHead className="w-[200px] text-primary/60 uppercase text-xs font-bold tracking-wider">Role</TableHead>
              <TableHead className="text-primary/60 uppercase text-xs font-bold tracking-wider">Description</TableHead>
              <TableHead className="text-right text-primary/60 uppercase text-xs font-bold tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center animate-pulse opacity-50">
                  Loading security configuration...
                </TableCell>
              </TableRow>
            ) : filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <RoleRow
                  key={role.name}
                  role={role}
                  variant="table"
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-contrast-ground/40 italic">
                  No roles found matching &quot;{search}&quot;
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {isLoading ? (
          <div className="h-32 flex items-center justify-center bg-elevated/10 rounded-xl border border-primary/10 animate-pulse opacity-50">
            Loading security configuration...
          </div>
        ) : filteredRoles.length > 0 ? (
          <div className="bg-elevated/10 rounded-xl border border-primary/10 overflow-hidden shadow-lg flex flex-col">
            {filteredRoles.map((role) => (
              <RoleRow
                key={role.name}
                role={role}
                variant="card"
              />
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center bg-elevated/10 rounded-xl border border-primary/10 text-contrast-ground/40 italic">
            No roles found matching &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}

export default SecurityManager;
