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
    <div className="p-4">
      <Header />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Path</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <PageRow key={page} page={page} />
          ))}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={2}>Loading...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminPage;
