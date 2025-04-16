"use client";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import { deletePage, getAllPaths } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPagePath, setNewPageName] = useState("");
  const router = useRouter();

  const { data: pages = [] } = useQuery({
    queryKey: ["pages"],
    queryFn: getAllPaths,
  });

  const onDeleteClick = async (page: string) => {
    if (confirm(`Are you sure you want to delete the page "${page}"?`)) {
      await deletePage(page);
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    }
  };

  const handleAddPageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewPageName("");
  };

  const handleCreatePage = () => {
    if (newPagePath.trim() !== "") {
      router.push(`/admin/editor/${newPagePath.trim()}`);
      handleCloseModal();
    } else {
      alert("Please enter a page name.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 justify-between mb-4">
        <h1>Leitereberiich</h1>
        <div className="flex flex-wrap gap-4">
          <div className="grid grid-rows-2 gap-2">
            <Button size="small" onClick={() => router.push("/admin/navbar")}>
              Navbar
            </Button>
            <Button size="small" onClick={() => router.push("/admin/footer")}>
              Footer
            </Button>
          </div>
          <Button onClick={handleAddPageClick}>Add Page</Button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex"></div>
        <div className="flex-col flex gap-3">
          {pages.map((page) => (
            <div
              key={page}
              className="border-2 rounded-xl border-primary p-4 flex justify-between"
            >
              <div>{page}</div>
              <div className="flex flex-wrap gap-3 justify-end">
                <Button size="small" onClick={() => router.push(`${page}`)}>
                  View
                </Button>
                <Button
                  size="small"
                  onClick={() => router.push(`/admin/editor${page}`)}
                >
                  Edit
                </Button>
                <Button size="small" onClick={() => onDeleteClick(page)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50">
          <div className="bg-background p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Add New Page</h2>
            <Input
              type="text"
              placeholder="Enter new page path"
              className="w-full mb-4"
              value={newPagePath}
              onChange={(e) => setNewPageName(e.target.value)}
            />
            <div className="flex flex-wrap justify-end gap-4">
              <Button size="small" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button size="small" onClick={handleCreatePage}>
                Create Page
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
