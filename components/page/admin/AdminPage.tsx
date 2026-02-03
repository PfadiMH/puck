"use client";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { getAllPaths } from "@lib/db/db-actions";
import { useQuery } from "@tanstack/react-query";
import Header from "./Header";
import PageRow from "./PageRow";

function AdminPage() {
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: getAllPaths,
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <Header />

      {/* Desktop Table View */}
      <div className="hidden md:block bg-elevated/10 rounded-xl border border-primary/10 overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-primary/10">
              <TableHead className="text-primary/60 uppercase text-xs font-bold tracking-wider">
                Path
              </TableHead>
              <TableHead className="text-right text-primary/60 uppercase text-xs font-bold tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="h-32 text-center animate-pulse opacity-50"
                >
                  Loading pages...
                </TableCell>
              </TableRow>
            ) : pages.length > 0 ? (
              pages.map((page) => (
                <PageRow key={page} page={page} variant="table" />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="h-32 text-center text-contrast-ground/40 italic"
                >
                  No pages found
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
            Loading pages...
          </div>
        ) : pages.length > 0 ? (
          <div className="bg-elevated/10 rounded-xl border border-primary/10 overflow-hidden shadow-lg flex flex-col">
            {pages.map((page) => (
              <PageRow key={page} page={page} variant="card" />
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center bg-elevated/10 rounded-xl border border-primary/10 text-contrast-ground/40 italic">
            No pages found
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
