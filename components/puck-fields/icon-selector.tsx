"use client";

import cn from "@lib/cn";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { PACKING_ICONS } from "@lib/packing-icons";
import { CustomField } from "@puckeditor/core";

type IconSelectorProps = string | undefined;

/**
 * IconSelector - A grid-based icon picker for Puck.
 * Allows selecting from predefined packing list icons.
 */
function IconSelector({
  id,
  onChange,
  value,
  readOnly,
}: CustomFieldRenderProps<IconSelectorProps>) {
  const selectedIcon = PACKING_ICONS.find((i) => i.id === value);

  return (
    <div className="flex flex-col gap-2" id={id}>
      {selectedIcon && (
        <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
          <selectedIcon.icon className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">{selectedIcon.label}</span>
          {!readOnly && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="ml-auto text-xs text-red-500 hover:text-red-700"
            >
              Entfernen
            </button>
          )}
        </div>
      )}

      {!readOnly && (
        <div className="grid grid-cols-6 gap-1">
          {PACKING_ICONS.map(({ id: iconId, icon: Icon, label }) => (
            <button
              key={iconId}
              type="button"
              onClick={() => onChange(iconId)}
              title={label}
              className={cn(
                "p-2 rounded-md transition-colors",
                "hover:bg-primary/20",
                "focus:outline-none focus:ring-2 focus:ring-primary/60",
                value === iconId
                  ? "bg-primary/30 ring-2 ring-primary"
                  : "bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5 mx-auto text-gray-700" />
            </button>
          ))}
        </div>
      )}

      {!selectedIcon && !readOnly && (
        <p className="text-xs text-gray-500">
          Klicke auf ein Icon um es auszuwählen (optional)
        </p>
      )}
    </div>
  );
}

export const iconSelectorField: CustomField<IconSelectorProps> = {
  type: "custom",
  label: "Icon",
  render: IconSelector,
};
