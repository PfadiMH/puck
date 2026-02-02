import { WithId, WithPuckProps } from "@measured/puck";

export function createPuckProps(): WithId<WithPuckProps<unknown>> {
  return {
    id: "test-puck-props-id",
    puck: {
      renderDropZone: () => <></>,
      isEditing: false,
      dragRef: null,
    },
  };
}
