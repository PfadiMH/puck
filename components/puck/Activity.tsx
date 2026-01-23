import { datePickerField } from "@components/puck-fields/date-picker";
import { timePickerField } from "@components/puck-fields/time-picker";
import { uploadFileField } from "@components/puck-fields/upload-file";
import { ComponentConfig } from "@measured/puck";
import { Calendar, Clock, MapPin, Backpack, Info } from "lucide-react";
import Image from "next/image";

export type MitnehmenItem = {
  name: string;
  icon?: string;
};

export type LocationInfo = {
  name: string;
  mapsLink?: string;
};

export type ActivityProps = {
  date: string;
  startTime: string;
  endTime: string;
  location: LocationInfo;
  endLocation?: LocationInfo;
  mitnehmen: MitnehmenItem[];
  bemerkung?: string;
};

function formatDate(dateString: string): string {
  if (!dateString) return "";
  // Parse YYYY-MM-DD without timezone shift by using component parts
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function isValidHttpUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function LocationDisplay({ label, location }: { label: string; location: LocationInfo }) {
  if (!location?.name) return null;
  
  const hasValidLink = isValidHttpUrl(location.mapsLink || "");
  
  return (
    <div className="flex items-start gap-2">
      <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
      <div>
        <span className="font-semibold">{label}: </span>
        {hasValidLink ? (
          <a 
            href={location.mapsLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            {location.name}
          </a>
        ) : (
          <span>{location.name}</span>
        )}
      </div>
    </div>
  );
}

function Activity({
  date,
  startTime,
  endTime,
  location,
  endLocation,
  mitnehmen,
  bemerkung,
}: ActivityProps) {
  const hasEndLocation = endLocation?.name && endLocation.name.trim() !== "";
  const hasLocation = location?.name && location.name.trim() !== "";
  const hasMitnehmen = mitnehmen && mitnehmen.length > 0 && mitnehmen.some(item => item.name?.trim());
  const hasBemerkung = bemerkung && bemerkung.trim() !== "";
  
  // Check what sections exist below each section for border logic
  const hasContentBelowDateTime = hasLocation || hasMitnehmen || hasBemerkung;
  const hasContentBelowLocation = hasMitnehmen || hasBemerkung;
  const hasContentBelowMitnehmen = hasBemerkung;
  
  return (
    <div className="bg-elevated rounded-lg p-6 shadow-md">
      {/* Date and Time */}
      <div className={hasContentBelowDateTime ? "mb-4 pb-4 border-b border-primary/20" : ""}>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>{startTime} - {endTime} Uhr</span>
        </div>
      </div>

      {/* Location(s) */}
      {hasLocation && (
        <div className={hasContentBelowLocation ? "mb-4 pb-4 border-b border-primary/20 space-y-2" : "space-y-2"}>
          {hasEndLocation ? (
            <>
              <LocationDisplay label="Besammlung" location={location} />
              <LocationDisplay label="Verabschiedung" location={endLocation} />
            </>
          ) : (
            <LocationDisplay label="Ort" location={location} />
          )}
        </div>
      )}

      {/* Mitnehmen */}
      {hasMitnehmen && (
        <div className={hasContentBelowMitnehmen ? "mb-4 pb-4 border-b border-primary/20" : ""}>
          <div className="flex items-center gap-2 mb-2">
            <Backpack className="w-5 h-5 text-primary" />
            <span className="font-semibold">Mitnehmen:</span>
          </div>
          <ul className="list-none pl-7 space-y-1">
            {mitnehmen.filter(item => item.name?.trim()).map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {item.icon ? (
                  <Image 
                    src={item.icon} 
                    alt="" 
                    width={20} 
                    height={20} 
                    className="w-5 h-5 object-contain"
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bemerkung */}
      {hasBemerkung && (
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
          <div>
            <span className="font-semibold">Bemerkung: </span>
            <span>{bemerkung}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export const activityConfig: ComponentConfig<ActivityProps> = {
  label: "Aktivität",
  render: Activity,
  fields: {
    date: datePickerField,
    startTime: {
      ...timePickerField,
      label: "Startzeit",
    },
    endTime: {
      ...timePickerField,
      label: "Endzeit",
    },
    location: {
      type: "object",
      label: "Ort",
      objectFields: {
        name: {
          type: "text",
          label: "Ortsname",
        },
        mapsLink: {
          type: "text",
          label: "Google Maps Link (optional)",
        },
      },
    },
    endLocation: {
      type: "object",
      label: "Endort (optional, für Wanderungen etc.)",
      objectFields: {
        name: {
          type: "text",
          label: "Ortsname",
        },
        mapsLink: {
          type: "text",
          label: "Google Maps Link (optional)",
        },
      },
    },
    mitnehmen: {
      type: "array",
      label: "Mitnehmen",
      arrayFields: {
        name: {
          type: "text",
          label: "Gegenstand",
        },
        icon: uploadFileField,
      },
      getItemSummary: (item) => item.name || "Neuer Gegenstand",
      defaultItemProps: {
        name: "",
        icon: undefined,
      },
    },
    bemerkung: {
      type: "textarea",
      label: "Bemerkung (optional)",
    },
  },
  defaultProps: {
    date: new Date().toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "17:00",
    location: {
      name: "",
      mapsLink: "",
    },
    endLocation: {
      name: "",
      mapsLink: "",
    },
    mitnehmen: [],
    bemerkung: "",
  },
};
