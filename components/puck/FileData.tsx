"use client"; // Add this if you're using the App Router and need client-side interactivity (like useState)
// Define SVG icons (you might import these from a library)
const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const ImageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const PresentationIcon = () => (
  // Using DocumentIcon as placeholder, you might find a better one
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11h-6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15h-6" />
  </svg>
);

const SpreadsheetIcon = () => (
  // Using DocumentIcon as placeholder
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v-6m-3 3h6" />
  </svg>
);

const VideoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const MoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 ml-1.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// Helper to get the right icon based on filename extension
const getFileIcon = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "docx":
    case "doc":
      return <DocumentIcon />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <ImageIcon />;
    case "pptx":
    case "ppt":
      return <PresentationIcon />;
    case "xlsx":
    case "xls":
    case "csv":
      return <SpreadsheetIcon />;
    case "mp4":
    case "mov":
    case "avi":
      return <VideoIcon />;
    default:
      return <DocumentIcon />; // Default icon
  }
};

// components/RecentlyUploadedFiles.tsx

import React, { useState } from "react";
import {
  FiChevronRight,
  FiDownload,
  FiMoreHorizontal,
  FiShare2,
  FiTrash2,
} from "react-icons/fi"; // Using Feather Icons

// Define the structure for file data
interface FileData {
  id: number;
  name: string;
  type: "docx" | "png" | "pptx" | "xlsx" | "mp4"; // Add more types as needed
  size: string;
  uploadDate: string;
}

// Sample data matching the image
const sampleFiles: FileData[] = [
  {
    id: 1,
    name: "project-proposal.docx",
    type: "docx",
    size: "2.38 MB",
    uploadDate: "Apr 15, 2025",
  },
  {
    id: 2,
    name: "company-logo.png",
    type: "png",
    size: "1.14 MB",
    uploadDate: "Apr 14, 2025",
  },
  {
    id: 3,
    name: "presentation.pptx",
    type: "pptx",
    size: "5.34 MB",
    uploadDate: "Apr 13, 2025",
  },
  {
    id: 4,
    name: "budget.xlsx",
    type: "xlsx",
    size: "957.03 KB",
    uploadDate: "Mar 12, 2025",
  },
  {
    id: 5,
    name: "product-video.mp4",
    type: "mp4",
    size: "150.68 MB",
    uploadDate: "Apr 11, 2025",
  },
];

const RecentlyUploadedFiles: React.FC = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  // In the image, only the menu for 'company-logo.png' (id: 2) is shown open.
  // We'll initialize the state to show that menu open for demonstration.
  // Set to `null` if you want all menus closed initially.
  useState<number | null>(2);

  const toggleMenu = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  // You might want to add a way to close the menu when clicking outside
  // (e.g., using useEffect and event listeners on the document)

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Recently Uploaded Files
        </h2>
        <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50 transition-colors">
          View All
          <FiChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>

      {/* File List */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          {" "}
          {/* min-w ensures table doesn't collapse too much on small screens */}
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                {" "}
                {/* Name column wider */}
                Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Size
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Upload Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Actions
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {sampleFiles.map((file, index) => (
              <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                {/* File Name & Icon */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </div>
                  </div>
                </td>

                {/* Size */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {file.size}
                </td>

                {/* Upload Date */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {file.uploadDate}
                </td>

                {/* Actions */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={() => toggleMenu(file.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-haspopup="true"
                    aria-expanded={openMenuIndex === file.id}
                    aria-label={`Actions for ${file.name}`}
                  >
                    <FiMoreHorizontal className="h-5 w-5" />
                  </button>

                  {/* Actions Dropdown Menu */}
                  {openMenuIndex === file.id && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby={`menu-button-${file.id}`} // You might need to add an id to the button
                    >
                      <div className="py-1" role="none">
                        <a
                          href="#" // Replace with actual download link/handler
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          id={`menu-item-0-${file.id}`}
                        >
                          <FiDownload
                            className="mr-3 h-4 w-4 text-gray-500"
                            aria-hidden="true"
                          />
                          Download
                        </a>
                        <button
                          onClick={() => alert(`Sharing ${file.name}`)} // Replace with actual share handler
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          id={`menu-item-1-${file.id}`}
                        >
                          <FiShare2
                            className="mr-3 h-4 w-4 text-gray-500"
                            aria-hidden="true"
                          />
                          Share
                        </button>
                        <button
                          onClick={() => alert(`Deleting ${file.name}`)} // Replace with actual delete handler + confirmation
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                          role="menuitem"
                          id={`menu-item-2-${file.id}`}
                        >
                          <FiTrash2
                            className="mr-3 h-4 w-4"
                            aria-hidden="true"
                          />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Optional: Add padding at the bottom if needed */}
      {/* <div className="p-4 sm:p-6"></div> */}
    </div>
  );
};

export default RecentlyUploadedFiles;
