"use client";

import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";
import { saveNavbar } from "@lib/database";
import { ReactNode } from "react";
import navbarConfig from "@config/navbar.config";

function HeaderActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2">
      <div className="grid grid-cols-1 gap-2">
        <a href="/admin" className="text-gray-700 hover:underline">
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-sm w-full">
            To Admin
          </button>
        </a>
        <a href={"/"} className="text-green-700 hover:underline">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm w-full">
            View Page
          </button>
        </a>
      </div>
      {children}
    </div>
  );
}

export function NavbarEditor({ data }: { data: Partial<Data> }) {
  return (
    <Puck
      config={navbarConfig}
      data={data}
      overrides={{
        headerActions: ({ children }) => (
          <HeaderActions>{children}</HeaderActions>
        ),
      }}
      headerTitle={`Editing Navbar`}
      onPublish={async (data) => {
        await saveNavbar(data);
      }}
    />
  );
}
