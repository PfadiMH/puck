"use client";

import { defaultSecurityConfig } from "@lib/security/permissions";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function DevSignInForm() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      roles: JSON.stringify(selectedRoles),
      redirectTo: "/",
    });
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Developer Login</h1>
        <p className="mb-4 text-sm text-gray-600">
          Select roles to simulate for your session. This is only available in development mode.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            {defaultSecurityConfig.roles.map((role) => (
              <label
                key={role.name}
                className="flex items-start space-x-3 rounded-md border p-3 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.name)}
                  onChange={() => toggleRole(role.name)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">{role.name}</div>
                  <div className="text-xs text-gray-500">{role.description}</div>
                </div>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign In with Selected Roles
          </button>
        </form>
      </div>
    </div>
  );
}
