"use client";
import Table, {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { getAllPaths } from "@lib/db/database";
import { useQuery } from "@tanstack/react-query";
import Header from "./Header";
import PageRow from "./PageRow";

function AdminPage() {
  const { data: pages = [] } = useQuery({
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <PageRow key={page} page={page} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminPage;
