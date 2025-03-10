"use client";
import { deletePage, getAllPaths } from "@lib/database";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [pages, setPages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPagePath, setNewPageName] = useState("");
  const router = useRouter();

  const loadPages = useCallback(async () => {
    const fetchedPages = await getAllPaths();
    setPages(fetchedPages);
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const onDeleteClick = useCallback(
    async (page: string) => {
      if (confirm(`Are you sure you want to delete the page "${page}"?`)) {
        await deletePage(page);
        loadPages();
      }
    },
    [loadPages]
  );

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
      <div className="flex justify-between items-center mb-4">
        <h1>Leitereberiich</h1>
        <div className="flex gap-4">
          <div className="grid grid-rows-2 gap-2">
            <a href="/admin/navbar">
              <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-4 rounded w-full">
                Navbar
              </button>
            </a>
            <a href="/admin/footer">
              <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-4 rounded w-full">
                Footer
              </button>
            </a>
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddPageClick}
          >
            Add Page
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Add New Page</h2>
            <input
              type="text"
              placeholder="Enter new page path"
              className="border p-2 rounded w-full mb-4"
              value={newPagePath}
              onChange={(e) => setNewPageName(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleCreatePage}
              >
                Create Page
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex flex-row"></div>
        <div className="flex-col flex gap-3">
          {pages.map((page) => (
            <div
              key={page}
              className="border-2 rounded-xl border-[--primary-color] p-4 flex flex-row justify-between"
            >
              <div>{page}</div>
              <div className="flex gap-3 flex-row">
                <a href={`${page}`}>
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    View
                  </button>
                </a>
                <a href={`/admin/editor${page}`}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                  </button>
                </a>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => onDeleteClick(page)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {pages.length === 0 && (
          <p>No pages found. Create a new page to get started.</p>
        )}
      </div>
    </div>
  );
}
