"use client";
import { deletePage, getAllPaths } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddPageModal from "./AddPageModal";
import AdminHeaderActions from "./AdminHeaderActions";
import AdminPageRow from "./AdminPageRow";

function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { data: pages = [] } = useQuery({
    queryKey: ["pages"],
    queryFn: getAllPaths,
  });

  const handleDeletePage = async (page: string) => {
    if (confirm(`Are you sure you want to delete the page "${page}"?`)) {
      await deletePage(page);
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    }
  };

  return (
    <div className="p-4">
      <AdminHeaderActions onClickAddPage={() => setIsModalOpen(true)} />

      <div className="flex flex-col">
        <div className="flex"></div>
        <div className="flex-col flex gap-3">
          {pages.map((page) => (
            <AdminPageRow
              key={page}
              page={page}
              onView={() => router.push(page)}
              onEdit={() => router.push(`/admin/editor${page}`)}
              onDelete={() => handleDeletePage(page)}
            />
          ))}
        </div>
      </div>

      {isModalOpen && <AddPageModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default AdminPage;
