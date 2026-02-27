import { CalendarAdmin } from "@components/calendar/CalendarAdmin";
import { requireServerPermission } from "@lib/security/server-guard";

export default async function AdminCalendarPage() {
  await requireServerPermission({ all: ["calendar:read"] });

  return (
    <main className="max-w-6xl mx-auto p-6">
      <CalendarAdmin />
    </main>
  );
}
