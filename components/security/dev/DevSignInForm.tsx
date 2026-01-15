"use client";

import Button from "@components/ui/Button";
import Card from "@components/ui/Card";
import { defaultSecurityConfig } from "@lib/security/security-config";
import { signIn } from "next-auth/react";
import { useState } from "react";

/**
 * Renders a developer-only sign-in form that lets a user select one or more roles and submit them for authentication.
 *
 * The form displays checkboxes for each role defined in the security configuration, tracks selected roles in component state, and submits the selected roles to the credentials sign-in flow.
 *
 * @returns The rendered sign-in form element.
 */
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-ground">
      <Card className="w-full max-w-lg shadow-2xl border border-primary/10">
        <h1 className="mb-2 text-3xl font-bold text-primary">
          Developer Login
        </h1>
        <p className="mb-8 text-contrast-ground/60">
          Select roles to simulate for your session. This is only available in
          development mode.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            {defaultSecurityConfig.roles.map((role) => (
              <label
                key={role.name}
                className="flex items-start space-x-4 rounded-xl border border-primary/10 p-4 hover:bg-primary/5 cursor-pointer transition-colors bg-elevated/20"
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.name)}
                  onChange={() => toggleRole(role.name)}
                  className="mt-1 h-5 w-5 rounded border-primary/20 text-primary focus:ring-primary bg-ground"
                />
                <div className="flex flex-col">
                  <div className="font-bold text-lg text-primary">
                    {role.name}
                  </div>
                  <div className="text-sm text-contrast-ground/60 leading-relaxed">
                    {role.description}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <Button type="submit" color="primary" size="large" className="w-full">
            Sign In with Selected Roles
          </Button>
        </form>
      </Card>
    </div>
  );
}